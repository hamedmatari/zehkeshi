"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { OrderStepper } from "@/components/OrderStepper"
import { LocationPicker } from "@/components/LocationPicker"
import { TimeslotPicker } from "@/components/TimeslotPicker"
import { OTPInput } from "@/components/OTPInput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { products } from "@/lib/data/products"
import { Order, Timeslot, LocationCoordinates } from "@/lib/types"
import { saveOrder } from "@/lib/store/orderStore"
import { ArrowLeft, ArrowRight } from "lucide-react"

const STEPS = ["محصول", "بستن راکت", "مکان", "زمان", "احراز هویت", "پرداخت"]

export default function OrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get("productId")

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(
    productId ? products.find((p) => p.id === productId) : products[0]
  )
  const [needsStringing, setNeedsStringing] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates | null>(null)
  const [selectedTimeslot, setSelectedTimeslot] = useState<Timeslot | undefined>()
  const [phone, setPhone] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (!selectedProduct) {
      router.push("/")
    }
  }, [selectedProduct, router])

  const handleSendOTP = async (phoneNumber: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("OTP sent to:", phoneNumber)
  }

  const handleOTPComplete = (otp: string, phoneNumber: string) => {
    setIsAuthenticated(true)
    setPhone(phoneNumber)
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePaymentRedirect = () => {
    if (
      selectedProduct &&
      selectedLocation &&
      selectedTimeslot &&
      isAuthenticated
    ) {
      const order: Partial<Order> = {
        productId: selectedProduct.id,
        locationId: `lat_${selectedLocation.lat}_lng_${selectedLocation.lng}`,
        locationCoordinates: selectedLocation,
        timeslot: selectedTimeslot,
        phone,
        needsStringing,
        status: "pending",
        createdAt: new Date().toISOString(),
      }
      saveOrder(order)
      router.push("/payment")
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!selectedProduct
      case 2:
        return true
      case 3:
        return !!selectedLocation
      case 4:
        return !!selectedTimeslot?.date && !!selectedTimeslot?.time
      case 5:
        return isAuthenticated
      default:
        return false
    }
  }

  if (!selectedProduct) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">ثبت سفارش</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <OrderStepper currentStep={currentStep} steps={STEPS} />

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">محصول انتخاب شده</h3>
                  <Card className="max-w-md mx-auto border-primary border-2">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-xl mb-2">{selectedProduct.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {selectedProduct.description}
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        ${selectedProduct.price.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                  <p className="text-sm text-muted-foreground mt-4">
                    برای تغییر محصول، می‌توانید از دکمه "قبلی" استفاده کنید
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">آیا می‌خواهید راکت شما با تار خریداری شده بسته شود؟</h3>
                  <p className="text-sm text-muted-foreground">
                    اگر راکت خود را دارید و می‌خواهید با تار انتخاب شده بسته شود، این گزینه را انتخاب کنید.
                  </p>
                  <Card
                    className={`cursor-pointer transition-colors ${
                      needsStringing ? "border-primary border-2" : ""
                    }`}
                    onClick={() => setNeedsStringing(!needsStringing)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={needsStringing}
                          onChange={() => setNeedsStringing(!needsStringing)}
                          className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">بله، می‌خواهم راکت من بسته شود</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            راکت شما با تار {selectedProduct.name} بسته خواهد شد
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <LocationPicker
                value={selectedLocation || undefined}
                onValueChange={setSelectedLocation}
              />
            )}

            {currentStep === 4 && (
              <TimeslotPicker
                value={selectedTimeslot}
                onValueChange={setSelectedTimeslot}
              />
            )}

            {currentStep === 5 && (
              <OTPInput
                onSendOTP={handleSendOTP}
                onComplete={handleOTPComplete}
              />
            )}

            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">خلاصه سفارش</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">محصول:</span>
                      <span>{selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">قیمت:</span>
                      <span>${selectedProduct.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">مکان:</span>
                      <span>
                        {selectedLocation?.address ||
                          `عرض: ${selectedLocation?.lat.toFixed(4)}, طول: ${selectedLocation?.lng.toFixed(4)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تاریخ:</span>
                      <span>{selectedTimeslot?.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">زمان:</span>
                      <span>{selectedTimeslot?.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">بستن راکت:</span>
                      <span>{needsStringing ? "بله" : "خیر"}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>مجموع:</span>
                      <span>${selectedProduct.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handlePaymentRedirect}
                  className="w-full"
                  size="lg"
                >
                  ادامه به پرداخت
                </Button>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                قبلی
              </Button>
              {currentStep < 6 && (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  بعدی
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

