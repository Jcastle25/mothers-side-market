'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type SetupState = { error?: string; message?: string } | undefined

export async function setupCreator(_state: SetupState, formData: FormData): Promise<SetupState> {
  const name = (formData.get('name') as string)?.trim()
  const bio = (formData.get('bio') as string)?.trim()
  const profileImageFile = formData.get('profile_image') as File | null

  if (!name) {
    return { error: 'Store name is required.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in.' }
  }

  // Check if creator already exists
  const { data: existingCreator } = await supabase
    .from('creators')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (existingCreator) {
    redirect('/dashboard')
  }

  let profileImageUrl: string | null = null

  if (profileImageFile && profileImageFile.size > 0) {
    const fileExt = profileImageFile.name.split('.').pop()
    const fileName = `${user.id}-profile.${fileExt}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, profileImageFile, { upsert: true })

    if (uploadError) {
      return { error: 'Failed to upload profile image.' }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    profileImageUrl = publicUrl
  }

  // Insert creator
  const { error: insertError } = await supabase.from('creators').insert([
    {
      user_id: user.id,
      name,
      bio: bio || null,
      profile_image: profileImageUrl,
      plan_type: 'free',
    },
  ])

  if (insertError) {
    return { error: 'Failed to create creator profile.' }
  }

  // Update user to is_creator = true
  const { error: updateError } = await supabase
    .from('users')
    .update({ is_creator: true })
    .eq('id', user.id)

  if (updateError) {
    // Log error but don't fail, as creator is created
    console.error('Failed to update user is_creator:', updateError)
  }

  redirect('/dashboard')
}