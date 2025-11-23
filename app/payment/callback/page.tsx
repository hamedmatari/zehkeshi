"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getOrder, clearOrder } from "@/lib/store/orderStore"
import { products } from "@/lib/data/products"
import { locations } from "@/lib/data/locations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

function PaymentCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const status = searchParams.get("status")
  const [order, setOrder] = useState(getOrder())

  useEffect(() => {
    if (status === "success") {
      const orderData = getOrder()
      setOrder(orderData)
    }
  }, [status])

  const handleContinue = () => {
    if (status === "success") {
      clearOrder()
    }
    router.push("/")
  }

  const product = order?.productId
    ? products.find((p) => p.id === order.productId)
    : null
  const location = order?.locationId
    ? locations.find((l) => l.id === order.locationId)
    : null

  if (status === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-center">پرداخت موفق!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 text-sm">
              <p className="text-center text-muted-foreground">
                سفارش شما تأیید شد
              </p>
              {order && (
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">شماره سفارش:</span>
                    <span className="font-mono text-xs">
                      {order.id || "ORD-" + Date.now().toString().slice(-6)}
                    </span>
                  </div>
                  {product && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">محصول:</span>
                      <span>{product.name}</span>
                    </div>
                  )}
                  {location && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">مکان:</span>
                      <span>{location.name}</span>
                    </div>
                  )}
                  {order.timeslot && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">تاریخ:</span>
                        <span>{order.timeslot.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">زمان:</span>
                        <span>{order.timeslot.time}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <Button onClick={handleContinue} className="w-full">
              ادامه خرید
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-center">پرداخت ناموفق</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            متأسفانه پرداخت شما انجام نشد. لطفاً دوباره تلاش کنید.
          </p>
          <Button onClick={handleContinue} className="w-full" variant="outline">
            بازگشت
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">در حال بارگذاری...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  )
}

