import { createClient } from '@/lib/supabase/server'
import BrowseClient, { BrowseProduct } from './BrowseClient'

type ProductRow = {
  id: string
  title: string
  category: string
  price: number
  product_type: string
  creators: { name: string }[] | null
}

export default async function BrowsePage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, title, category, price, product_type, creators(name)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const products: BrowseProduct[] = (data ?? []).map((item: ProductRow) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    price: item.price,
    product_type: item.product_type,
    creator_name: item.creators?.[0]?.name ?? 'Creator',
  }))

  return <BrowseClient initialProducts={products} />
}
