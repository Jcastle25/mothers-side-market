import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const db = createServiceClient()
  const purchaseId = resolvedParams.id

  const { data: purchase, error: purchaseError } = await db
    .from('purchases')
    .select('id, access_granted, product_id, product:products(file_url, product_type)')
    .eq('id', purchaseId)
    .single()

  if (purchaseError || !purchase) {
    return new NextResponse('Purchase not found', { status: 404 })
  }

  if (!purchase.access_granted) {
    return new NextResponse('Download access not granted', { status: 403 })
  }

  const product = Array.isArray(purchase.product) ? purchase.product[0] : purchase.product
  const fileUrl = product?.file_url
  if (!fileUrl || product?.product_type === 'physical') {
    return new NextResponse('No digital file available for this purchase', { status: 400 })
  }

  const { data, error: urlError } = await db.storage
    .from('product-files')
    .createSignedUrl(fileUrl, 60)

  if (urlError || !data) {
    return new NextResponse('Could not create download link', { status: 500 })
  }

  return NextResponse.redirect(data.signedUrl)
}
