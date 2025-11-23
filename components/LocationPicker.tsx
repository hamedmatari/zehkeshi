"use client"

import { useState, useEffect, useRef } from "react"
import { LocationCoordinates } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { MapPin, AlertCircle } from "lucide-react"

interface LocationPickerProps {
  value?: LocationCoordinates
  onValueChange: (value: LocationCoordinates | null) => void
}

const TEHRAN_CENTER: [number, number] = [35.800073252517375, 51.457020781948685]

const TEHRAN_POLYGON: [number, number][] = [
  [35.80803303246509, 51.438431141957835],
  [35.79211347356966, 51.438431141957835],
  [35.79211347356966, 51.475610421939535],
  [35.80803303246509, 51.475610421939535],
  [35.80803303246509, 51.438431141957835],
]

const TEHRAN_BOUNDS = {
  north: 35.80803303246509,
  south: 35.79211347356966,
  east: 51.475610421939535,
  west: 51.438431141957835,
}

function pointInPolygon(lat: number, lng: number, polygon: [number, number][]): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [latI, lngI] = polygon[i]
    const [latJ, lngJ] = polygon[j]
    
    const intersect =
      lngI > lng !== lngJ > lng && 
      lat < ((latJ - latI) * (lng - lngI)) / (lngJ - lngI) + latI
    if (intersect) inside = !inside
  }
  return inside
}

function isWithinTehran(lat: number, lng: number): boolean {
  return pointInPolygon(lat, lng, TEHRAN_POLYGON)
}

export function LocationPicker({
  value,
  onValueChange,
}: LocationPickerProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [address, setAddress] = useState(value?.address || "")
  const [error, setError] = useState<string>("")
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const addressRef = useRef<string>(value?.address || "")
  const onValueChangeRef = useRef(onValueChange)

  useEffect(() => {
    onValueChangeRef.current = onValueChange
  }, [onValueChange])

  useEffect(() => {
    const newAddress = value?.address || ""
    setAddress(newAddress)
    addressRef.current = newAddress
  }, [value?.address])

  useEffect(() => {
    if (typeof window !== "undefined" && !mapLoaded) {
      if ((window as any).L) {
        setMapLoaded(true)
        return
      }

      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
        setMapLoaded(true)
      }
      document.head.appendChild(script)
    }
  }, [mapLoaded])

  useEffect(() => {
    if (mapLoaded && mapRef.current && !mapInstanceRef.current) {
      const L = (window as any).L
      const defaultCenter: [number, number] = value
        ? [value.lat, value.lng]
        : TEHRAN_CENTER

      const tehranBounds = L.latLngBounds(
        [TEHRAN_BOUNDS.south, TEHRAN_BOUNDS.west],
        [TEHRAN_BOUNDS.north, TEHRAN_BOUNDS.east]
      )

      const map = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: value ? 15 : 12,
        minZoom: 11,
        maxZoom: 18,
        maxBounds: tehranBounds,
        maxBoundsViscosity: 1.0,
        worldCopyJump: false,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      map.setMaxBounds(tehranBounds)

      const tehranPolygon = L.polygon(
        TEHRAN_POLYGON.map(([lat, lng]) => [lat, lng]),
        {
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.1,
          weight: 2,
        }
      ).addTo(map)

      if (value && isWithinTehran(value.lat, value.lng)) {
        const marker = L.marker([value.lat, value.lng], {
          draggable: true,
        }).addTo(map)
        markerRef.current = marker

        marker.on("drag", (e: any) => {
          const position = e.target.getLatLng()
          if (!isWithinTehran(position.lat, position.lng)) {
            e.target.setLatLng([value.lat, value.lng])
            setError("لطفاً مکانی در محدوده تهران انتخاب کنید")
            setTimeout(() => setError(""), 3000)
          } else {
            setError("")
          }
        })

        marker.on("dragend", (e: any) => {
          const position = e.target.getLatLng()
          if (isWithinTehran(position.lat, position.lng)) {
            setError("")
            onValueChangeRef.current({
              lat: position.lat,
              lng: position.lng,
              address: addressRef.current || undefined,
            })
          } else {
            e.target.setLatLng([value.lat, value.lng])
            setError("لطفاً مکانی در محدوده تهران انتخاب کنید")
            setTimeout(() => setError(""), 3000)
          }
        })
      }

      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng

        if (!isWithinTehran(lat, lng)) {
          setError("لطفاً مکانی در محدوده تهران انتخاب کنید")
          setTimeout(() => setError(""), 3000)
          return
        }

        setError("")

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
        } else {
          const marker = L.marker([lat, lng], {
            draggable: true,
          }).addTo(map)
          markerRef.current = marker

          marker.on("drag", (e: any) => {
            const position = e.target.getLatLng()
            if (!isWithinTehran(position.lat, position.lng)) {
              e.target.setLatLng([lat, lng])
              setError("لطفاً مکانی در محدوده تهران انتخاب کنید")
              setTimeout(() => setError(""), 3000)
            } else {
              setError("")
            }
          })

          marker.on("dragend", (e: any) => {
            const position = e.target.getLatLng()
            if (isWithinTehran(position.lat, position.lng)) {
              setError("")
              onValueChangeRef.current({
                lat: position.lat,
                lng: position.lng,
                address: addressRef.current || undefined,
              })
            } else {
              e.target.setLatLng([lat, lng])
              setError("لطفاً مکانی در محدوده تهران انتخاب کنید")
              setTimeout(() => setError(""), 3000)
            }
          })
        }

        onValueChangeRef.current({
          lat,
          lng,
          address: addressRef.current || undefined,
        })
      })

      mapInstanceRef.current = map
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [mapLoaded])

  useEffect(() => {
    if (mapInstanceRef.current && value) {
      if (isWithinTehran(value.lat, value.lng)) {
        if (markerRef.current) {
          markerRef.current.setLatLng([value.lat, value.lng])
        } else {
          const L = (window as any).L
          const marker = L.marker([value.lat, value.lng], {
            draggable: true,
          }).addTo(mapInstanceRef.current)
          markerRef.current = marker

          marker.on("drag", (e: any) => {
            const position = e.target.getLatLng()
            if (!isWithinTehran(position.lat, position.lng)) {
              e.target.setLatLng([value.lat, value.lng])
              setError("لطفاً مکانی در محدوده تهران انتخاب کنید")
              setTimeout(() => setError(""), 3000)
            } else {
              setError("")
            }
          })

          marker.on("dragend", (e: any) => {
            const position = e.target.getLatLng()
            if (isWithinTehran(position.lat, position.lng)) {
              setError("")
              onValueChangeRef.current({
                lat: position.lat,
                lng: position.lng,
                address: addressRef.current || undefined,
              })
            } else {
              e.target.setLatLng([value.lat, value.lng])
              setError("لطفاً مکانی در محدوده تهران انتخاب کنید")
              setTimeout(() => setError(""), 3000)
            }
          })
        }
        mapInstanceRef.current.setView([value.lat, value.lng], 15)
      } else {
        setError("مکان انتخاب شده خارج از محدوده تهران است")
        onValueChangeRef.current(null)
      }
    }
  }, [value])

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress)
    addressRef.current = newAddress
    if (value) {
      onValueChange({
        ...value,
        address: newAddress || undefined,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location-map">انتخاب مکان روی نقشه (فقط محدوده تهران)</Label>
        <div className="relative w-full h-[400px] rounded-md border border-input bg-muted overflow-hidden">
          <div
            ref={mapRef}
            className="w-full h-full"
            style={{ direction: "ltr" }}
          />
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
              در حال بارگذاری نقشه...
            </div>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded-md">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">آدرس (اختیاری)</Label>
        <div className="relative">
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="address"
            type="text"
            placeholder="آدرس دقیق را وارد کنید (اختیاری)"
            value={address}
            onChange={(e) => handleAddressChange(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>
      {value && (
        <div className="text-sm text-muted-foreground">
          <p>مختصات انتخاب شده:</p>
          <p>
            عرض جغرافیایی: {value.lat.toFixed(6)}, طول جغرافیایی:{" "}
            {value.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  )
}

