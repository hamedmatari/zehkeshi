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
import { locations } from "@/lib/data/locations"
import { Order, Timeslot } from "@/lib/types"
import { saveOrder } from "@/lib/store/orderStore"
import { ArrowLeft, ArrowRight } from "lucide-react"

const STEPS = ["Product", "Location", "Timeslot", "Authentication", "Payment"]

export default function OrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get("productId")

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(
    productId ? products.find((p) => p.id === productId) : products[0]
  )
  const [selectedLocation, setSelectedLocation] = useState<string>("")
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
        locationId: selectedLocation,
        timeslot: selectedTimeslot,
        phone,
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
        return !!selectedLocation
      case 3:
        return !!selectedTimeslot?.date && !!selectedTimeslot?.time
      case 4:
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
          <h1 className="text-3xl font-bold">Place Your Order</h1>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className={`cursor-pointer transition-colors ${
                        selectedProduct.id === product.id
                          ? "border-primary border-2"
                          : ""
                      }`}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {product.description}
                        </p>
                        <p className="text-lg font-bold mt-2">
                          ${product.price.toFixed(2)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <LocationPicker
                locations={locations}
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              />
            )}

            {currentStep === 3 && (
              <TimeslotPicker
                value={selectedTimeslot}
                onValueChange={setSelectedTimeslot}
              />
            )}

            {currentStep === 4 && (
              <OTPInput
                onSendOTP={handleSendOTP}
                onComplete={handleOTPComplete}
              />
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Product:</span>
                      <span>{selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span>${selectedProduct.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>
                        {
                          locations.find((l) => l.id === selectedLocation)
                            ?.name
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{selectedTimeslot?.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{selectedTimeslot?.time}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total:</span>
                      <span>${selectedProduct.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handlePaymentRedirect}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Payment
                </Button>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {currentStep < 5 && (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

