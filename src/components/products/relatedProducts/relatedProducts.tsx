'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'

interface RelatedProduct {
  id: number
  name: string
  image: string
  price: number
  originalPrice?: number
  discount?: number
}

const relatedProducts: RelatedProduct[] = [
  {
    id: 1,
    name: "IPHONE 15 PRO MAX",
    image: "/placeholder.svg",
    price: 1299.00,
    originalPrice: 1499.00,
    discount: 20
  },
  {
    id: 2,
    name: "4K ULTRA HD TV 55",
    image: "/placeholder.svg",
    price: 799.99,
    originalPrice: 999.99,
    discount: 20
  },
  {
    id: 3,
    name: "BLUETOOTH SPEAKER BOOM X",
    image: "/placeholder.svg",
    price: 89.99
  },
  {
    id: 4,
    name: "GAMING HEADSET ULTRASOUND",
    image: "/placeholder.svg",
    price: 79.99
  }
]

export default function RelatedProducts() {
  return (
    <div className="related-products mt-12">
      <h2 className="text-xl font-bold mb-6">CUSTOMERS WHO VIEWED THIS PRODUCT ALSO VIEWED:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Link 
            key={product.id} 
            href={`/products/${product.id}`}
            className="group relative bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {product.discount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{product.discount}%
              </div>
            )}
            <div className="relative w-full aspect-square mb-4">
              <Image
                src={product.image}
                alt={product.name}
                layout="fill"
                objectFit="contain"
                className="group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

