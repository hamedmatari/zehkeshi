import { Timeslot } from "@/lib/types"
import { addDays, format, setHours, setMinutes } from "date-fns"

export function generateTimeslots(startDate: Date, days: number = 14): Timeslot[] {
  const timeslots: Timeslot[] = []
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ]

  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i)
    const dateStr = format(date, "yyyy-MM-dd")

    for (const time of timeSlots) {
      timeslots.push({
        date: dateStr,
        time,
        available: true
      })
    }
  }

  return timeslots
}

export function getAvailableTimeslots(date: string): Timeslot[] {
  const today = new Date()
  const selectedDate = new Date(date)
  
  if (selectedDate < today) {
    return []
  }

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ]

  return timeSlots.map(time => ({
    date,
    time,
    available: true
  }))
}

