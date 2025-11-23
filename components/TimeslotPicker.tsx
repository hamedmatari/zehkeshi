"use client"

import { useState } from "react"
import { Timeslot } from "@/lib/types"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { getAvailableTimeslots } from "@/lib/data/timeslots"
import { Card, CardContent } from "@/components/ui/card"

interface TimeslotPickerProps {
  value?: Timeslot
  onValueChange: (timeslot: Timeslot) => void
}

export function TimeslotPicker({
  value,
  onValueChange,
}: TimeslotPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value?.date ? new Date(value.date) : undefined
  )

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      const dateStr = format(date, "yyyy-MM-dd")
      if (value?.date !== dateStr) {
        onValueChange({
          date: dateStr,
          time: "",
          available: true,
        })
      }
    }
  }

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      onValueChange({
        date: format(selectedDate, "yyyy-MM-dd"),
        time,
        available: true,
      })
    }
  }

  const availableTimes = selectedDate
    ? getAvailableTimeslots(format(selectedDate, "yyyy-MM-dd"))
    : []

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Date</Label>
        <Card>
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date()}
              className="rounded-md"
            />
          </CardContent>
        </Card>
      </div>

      {selectedDate && (
        <div className="space-y-2">
          <Label htmlFor="time">Select Time</Label>
          <Select
            value={value?.time}
            onValueChange={handleTimeSelect}
          >
            <SelectTrigger id="time" className="w-full">
              <SelectValue placeholder="Select a time slot" />
            </SelectTrigger>
            <SelectContent>
              {availableTimes.map((slot) => (
                <SelectItem key={slot.time} value={slot.time}>
                  {slot.time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}

