"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getOrder, clearOrder } from "@/lib/store/orderStore"
import { products } from "@/lib/data/products"
import { locations } from "@/lib/data/locations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const order = getOrder()
    if (!order) {
      router.push("/")
      return
    }

    const timer = setTimeout(() => {
      const success = Math.random() > 0.2
      const status = success ? "success" : "failed"
      router.push(`/payment/callback?status=${status}`)
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">در حال پردازش پرداخت</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground text-center">
              لطفاً صبر کنید تا پرداخت شما پردازش شود...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

