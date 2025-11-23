export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  specs: {
    material?: string
    gauge?: string
    tension?: string
    color?: string
  }
}

export interface Location {
  id: string
  name: string
  address: string
  available: boolean
}

export interface Timeslot {
  date: string
  time: string
  available: boolean
}

export interface Order {
  id: string
  productId: string
  locationId: string
  timeslot: Timeslot
  phone: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: string
}

