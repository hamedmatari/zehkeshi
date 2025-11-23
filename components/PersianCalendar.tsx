"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import jalaali from "jalaali-js"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface PersianCalendarProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
  mode?: "single"
}

const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
]

const PERSIAN_WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"]

function getPersianDate(date: Date) {
  const { jy, jm, jd } = jalaali.toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  return { year: jy, month: jm, day: jd }
}

function getGregorianDate(jy: number, jm: number, jd: number): Date {
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd)
  return new Date(gy, gm - 1, gd)
}

function getFirstDayOfMonth(jy: number, jm: number): number {
  const firstDay = getGregorianDate(jy, jm, 1)
  const dayOfWeek = firstDay.getDay()
  return (dayOfWeek + 1) % 7
}

export function PersianCalendar({
  selected,
  onSelect,
  disabled,
  className,
  mode = "single",
}: PersianCalendarProps) {
  const today = new Date()
  const todayPersian = getPersianDate(today)
  const selectedPersian = selected ? getPersianDate(selected) : null

  const [currentYear, setCurrentYear] = React.useState(
    selectedPersian?.year || todayPersian.year
  )
  const [currentMonth, setCurrentMonth] = React.useState(
    selectedPersian?.month || todayPersian.month
  )

  React.useEffect(() => {
    if (selected) {
      const persian = getPersianDate(selected)
      setCurrentYear(persian.year)
      setCurrentMonth(persian.month)
    }
  }, [selected])

  const daysInMonth = jalaali.jalaaliMonthLength(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDayClick = (day: number) => {
    const date = getGregorianDate(currentYear, currentMonth, day)
    if (disabled && disabled(date)) {
      return
    }
    onSelect?.(date)
  }

  const isToday = (day: number) => {
    return (
      currentYear === todayPersian.year &&
      currentMonth === todayPersian.month &&
      day === todayPersian.day
    )
  }

  const isSelected = (day: number) => {
    if (!selectedPersian) return false
    return (
      currentYear === selectedPersian.year &&
      currentMonth === selectedPersian.month &&
      day === selectedPersian.day
    )
  }

  const isDisabled = (day: number) => {
    const date = getGregorianDate(currentYear, currentMonth, day)
    return disabled ? disabled(date) : false
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyCells = Array.from({ length: firstDay }, (_, i) => i)

  return (
    <div className={cn("p-3", className)}>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center pt-1 relative items-center">
          <button
            type="button"
            onClick={handlePrevMonth}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="text-sm font-medium">
            {PERSIAN_MONTHS[currentMonth - 1]} {currentYear}
          </div>
          <button
            type="button"
            onClick={handleNextMonth}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
        <div className="w-full border-collapse space-y-1">
          <div className="flex">
            {PERSIAN_WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="flex flex-col space-y-1">
            {Array.from({ length: Math.ceil((emptyCells.length + days.length) / 7) }).map(
              (_, weekIndex) => (
                <div key={weekIndex} className="flex w-full">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dayNumber = weekIndex * 7 + dayIndex - emptyCells.length + 1
                    const isEmpty = dayNumber < 1 || dayNumber > daysInMonth

                    if (isEmpty) {
                      return (
                        <div
                          key={dayIndex}
                          className="h-9 w-9 text-center text-sm p-0 relative"
                        />
                      )
                    }

                    return (
                      <div
                        key={dayIndex}
                        className="h-9 w-9 text-center text-sm p-0 relative"
                      >
                        <button
                          type="button"
                          onClick={() => handleDayClick(dayNumber)}
                          disabled={isDisabled(dayNumber)}
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                            isToday(dayNumber) && "bg-accent text-accent-foreground",
                            isSelected(dayNumber) &&
                              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                            isDisabled(dayNumber) && "text-muted-foreground opacity-50"
                          )}
                        >
                          {dayNumber}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

