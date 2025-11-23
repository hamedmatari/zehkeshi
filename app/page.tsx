import { products } from "@/lib/data/products"
import { ProductCard } from "@/components/ProductCard"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">سرویس بستن راکت تنیس</h1>
          <p className="text-muted-foreground mt-2">
            سرویس حرفه‌ای بستن راکت تنیس شما
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">تارهای موجود</h2>
          <p className="text-muted-foreground">
            از مجموعه تارهای باکیفیت ما انتخاب کنید
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  )
}

