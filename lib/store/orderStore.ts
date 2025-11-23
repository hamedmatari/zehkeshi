import { Order } from "@/lib/types"

const ORDER_STORAGE_KEY = "tennis_order"

export function saveOrder(order: Partial<Order>): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order))
  }
}

export function getOrder(): Partial<Order> | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(ORDER_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  }
  return null
}

export function clearOrder(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ORDER_STORAGE_KEY)
  }
}

