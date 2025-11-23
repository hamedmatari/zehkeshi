"use client"

import { useState, useRef, KeyboardEvent, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface OTPInputProps {
  onComplete: (otp: string, phone: string) => void
  onSendOTP: (phone: string) => Promise<void>
}

export function OTPInput({ onComplete, onSendOTP }: OTPInputProps) {
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setPhone(value)
  }

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      return
    }
    setIsLoading(true)
    try {
      await onSendOTP(phone)
      setOtpSent(true)
    } catch (error) {
      console.error("Failed to send OTP:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((digit) => digit !== "")) {
      const otpString = newOtp.join("")
      handleVerifyOTP(otpString)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "")
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("")
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
      handleVerifyOTP(pastedData)
    }
  }

  const handleVerifyOTP = async (otpString: string) => {
    setIsVerifying(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (otpString === "123456") {
      onComplete(otpString, phone)
    } else {
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }
    setIsVerifying(false)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">شماره تلفن</Label>
        <div className="flex gap-2">
          <Input
            id="phone"
            type="tel"
            placeholder="شماره تلفن خود را وارد کنید"
            value={phone}
            onChange={handlePhoneChange}
            maxLength={15}
            disabled={otpSent}
          />
          <Button
            onClick={handleSendOTP}
            disabled={phone.length < 10 || isLoading || otpSent}
          >
            {isLoading ? "در حال ارسال..." : "ارسال کد"}
          </Button>
        </div>
      </div>

      {otpSent && (
        <div className="space-y-2">
          <Label>کد تأیید را وارد کنید</Label>
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-lg"
                disabled={isVerifying}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            کد ۶ رقمی ارسال شده به تلفن خود را وارد کنید
          </p>
          {isVerifying && (
            <p className="text-sm text-center text-muted-foreground">
              در حال تأیید...
            </p>
          )}
        </div>
      )}
    </div>
  )
}

