import { createClient } from '@/lib/supabase/server'
import BrowseClient, { BrowseProduct } from './BrowseClient'

type ProductRow = {
  id: string
  title: string
  category: string
  price: number
  product_type: string
  creators: { name: string; badges: string[]; users: { is_blocked: boolean }[] | null }[] | null
}

export default async function BrowsePage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, title, category, price, product_type, creators(name, badges, users(is_blocked))')
    .eq('is_published', true)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })

  const products: BrowseProduct[] = (data ?? [])
    .filter((item: ProductRow) => {
      const creatorUser = item.creators?.[0]?.users?.[0]
      return !creatorUser?.is_blocked
    })
    .map((item: ProductRow) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      price: item.price,
      product_type: item.product_type,
      creator_name: item.creators?.[0]?.name ?? 'Creator',
      creator_badges: item.creators?.[0]?.badges ?? [],
    }))

  return <BrowseClient initialProducts={products} />
}
