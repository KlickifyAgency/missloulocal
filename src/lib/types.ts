export type Tier = 'free' | 'basic' | 'featured' | 'premium'

export type Category = {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  order_index: number
}

export type Business = {
  id: string
  name: string
  slug: string
  category_id: string
  category?: Category
  description: string | null
  address: string | null
  city: string
  state: string
  zip: string
  phone: string | null
  website: string | null
  email: string | null
  latitude: number | null
  longitude: number | null
  hours: Record<string, string> | null
  photos: string[]
  tier: Tier
  is_active: boolean
  is_verified: boolean
  views_count: number
  clicks_count: number
  created_at: string
  updated_at: string
  discounts?: Discount[]
  reviews?: Review[]
}

export type Discount = {
  id: string
  business_id: string
  title: string
  description: string | null
  discount_value: string | null
  code: string | null
  expires_at: string | null
  is_active: boolean
  created_at: string
}

export type Review = {
  id: string
  business_id: string
  user_name: string
  rating: number
  comment: string | null
  is_approved: boolean
  created_at: string
}

export type Event = {
  id: string
  title: string
  description: string | null
  business_id: string | null
  address: string | null
  starts_at: string
  ends_at: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
}
