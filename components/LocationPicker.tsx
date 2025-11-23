"use client"

import { Location } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface LocationPickerProps {
  locations: Location[]
  value?: string
  onValueChange: (value: string) => void
}

export function LocationPicker({
  locations,
  value,
  onValueChange,
}: LocationPickerProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="location">Pickup Location</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="location" className="w-full">
          <SelectValue placeholder="Select a location" />
        </SelectTrigger>
        <SelectContent>
          {locations
            .filter((loc) => loc.available)
            .map((location) => (
              <SelectItem key={location.id} value={location.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{location.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {location.address}
                  </span>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  )
}

