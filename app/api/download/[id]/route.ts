import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: purchaseId } = await params

  // Verify the requesting user owns this purchase
  const userClient = await createClient()
  const { data: { user } } = await userClient.auth.getUser()

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const db = createServiceClient()

  const { data: purchase, error: purchaseError } = await db
    .from('purchases')
    .select('id, user_id, access_granted, download_count, product_id, products(file_url, product_type)')
    .eq('id', purchaseId)
    .single()

  if (purchaseError || !purchase) {
    return new NextResponse('Purchase not found', { status: 404 })
  }

  if (purchase.user_id !== user.id) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  if (!purchase.access_granted) {
    return new NextResponse('Download access not granted', { status: 403 })
  }

  const product = Array.isArray(purchase.products) ? purchase.products[0] : purchase.products as any
  const filePath = product?.file_url

  if (!filePath || product?.product_type === 'physical') {
    return new NextResponse('No digital file available for this purchase', { status: 400 })
  }

  const { data: signedData, error: urlError } = await db.storage
    .from('product-files')
    .createSignedUrl(filePath, 60)

  if (urlError || !signedData) {
    console.error('[download] Signed URL error:', urlError)
    return new NextResponse('Could not create download link', { status: 500 })
  }

  // Increment download count
  await db
    .from('purchases')
    .update({ download_count: (purchase.download_count ?? 0) + 1 })
    .eq('id', purchaseId)

  return NextResponse.redirect(signedData.signedUrl)
}
