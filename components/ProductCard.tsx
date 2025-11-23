"use client"

import { Product } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()

  const handleSelect = () => {
    router.push(`/order?productId=${product.id}`)
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="aspect-video w-full bg-muted rounded-md mb-4 flex items-center justify-center">
          <span className="text-muted-foreground text-sm">تصویر محصول</span>
        </div>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          {product.specs.material && (
            <div className="text-sm">
              <span className="font-medium">جنس: </span>
              <span className="text-muted-foreground">{product.specs.material}</span>
            </div>
          )}
          {product.specs.gauge && (
            <div className="text-sm">
              <span className="font-medium">ضخامت: </span>
              <span className="text-muted-foreground">{product.specs.gauge}</span>
            </div>
          )}
          {product.specs.tension && (
            <div className="text-sm">
              <span className="font-medium">کشش: </span>
              <span className="text-muted-foreground">{product.specs.tension}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
        <Button onClick={handleSelect}>انتخاب</Button>
      </CardFooter>
    </Card>
  )
}

