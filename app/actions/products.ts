'use server'

import { createClient } from '@/lib/supabase/server'

export type ProductActionState = { error?: string; message?: string } | undefined

async function uploadAsset(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  pathPrefix: string
): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'bin'
  const fileName = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, { upsert: true })

  if (uploadError || !uploadData) {
    throw new Error('Failed to upload file to storage.')
  }

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)

  return publicUrl
}

export async function createProduct(_state: ProductActionState, formData: FormData): Promise<ProductActionState> {
  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()
  const category = (formData.get('category') as string)?.trim()
  const priceValue = (formData.get('price') as string)?.trim()
  const productType = (formData.get('product_type') as string) || 'digital'
  const productFile = formData.get('product_file') as File | null
  const previewFiles = formData.getAll('preview_images') as File[]
  const shippingPriceRaw = (formData.get('shipping_price') as string)?.trim()
  const shippingDescription = (formData.get('shipping_description') as string)?.trim() || null
  const stockQuantityRaw = (formData.get('stock_quantity') as string)?.trim()
  const saveAction = (formData.get('save_action') as string) || 'draft'
  const isPublished = saveAction === 'publish'

  if (!title || !description || !category || !priceValue) {
    return { error: 'Title, description, category, and price are required.' }
  }

  const price = Math.round(Number(priceValue) * 100)
  if (Number.isNaN(price) || price < 0) {
    return { error: 'Price must be a valid dollar amount.' }
  }

  let shippingPrice: number | null = null
  let stockQuantity: number | null = null

  if (productType === 'digital') {
    if (!productFile || productFile.size === 0) {
      return { error: 'A digital file is required for digital products.' }
    }
  }

  if (productType === 'physical') {
    if (!shippingPriceRaw) {
      return { error: 'Shipping price is required for physical products.' }
    }

    shippingPrice = Math.round(Number(shippingPriceRaw) * 100)
    if (Number.isNaN(shippingPrice) || shippingPrice < 0) {
      return { error: 'Shipping price must be a valid dollar amount.' }
    }

    if (stockQuantityRaw) {
      stockQuantity = Number(stockQuantityRaw)
      if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
        return { error: 'Stock quantity must be a valid whole number.' }
      }
    }
  }

  const previewImages: string[] = []
  const previewFileEntries = previewFiles.filter((item) => item instanceof File && item.size > 0)
  if (previewFileEntries.length > 4) {
    return { error: 'You can upload up to 4 preview images.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to upload products.' }
  }

  const { data: creator, error: creatorError } = await supabase
    .from('creators')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (creatorError || !creator) {
    return {
      error:
        'Creator profile not found. Complete your creator onboarding before uploading products.',
    }
  }

  let fileUrl: string | null = null
  if (productType === 'digital' && productFile) {
    try {
      fileUrl = await uploadAsset(supabase, productFile, `products/${user.id}/files`)
    } catch (error) {
      return { error: 'Failed to upload the digital product file.' }
    }
  }

  for (const imageFile of previewFileEntries) {
    try {
      const imageUrl = await uploadAsset(supabase, imageFile, `products/${user.id}/previews`)
      previewImages.push(imageUrl)
    } catch (error) {
      return { error: 'Failed to upload one of the preview images.' }
    }
  }

  const { error } = await supabase.from('products').insert([
    {
      creator_id: creator.id,
      title,
      description,
      category,
      price,
      product_type: productType,
      shipping_price: shippingPrice,
      shipping_description: shippingDescription,
      stock_quantity: stockQuantity,
      file_url: fileUrl,
      preview_images: previewImages,
      is_published: isPublished,
    },
  ])

  if (error) {
    return { error: error.message }
  }

  return { message: isPublished ? 'Product published successfully.' : 'Draft saved successfully.' }
}
