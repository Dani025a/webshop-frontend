'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import './relatedProducts.css'

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
    image: "https://www.telia.dk/globalassets/olympus/inriver/iphone_15_black_pure_back_iphone_15_black_pure_front_2up_screen__wwen.png?w=480",
    price: 1299.00,
    originalPrice: 1499.00,
    discount: 20
  },
  {
    id: 2,
    name: "4K ULTRA HD TV 55",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTYcD-cGcRpFxFG9KNpvaWfdn6xsUdP6LaZA&s",
    price: 799.99,
    originalPrice: 999.99,
    discount: 20
  },
  {
    id: 3,
    name: "BLUETOOTH SPEAKER BOOM X",
    image: "https://www.manua.ls/thumbs/products/l/1812440-exibel-boom-x.webp",
    price: 89.99
  },
  {
    id: 4,
    name: "GAMING HEADSET ULTRASOUND",
    image: "https://www.ultrasound.co.za/cdn/shop/products/beyerdynamic-mmx-100-black-perspective_1024x1024.webp?v=1679899703",
    price: 79.99
  }
]

export default function RelatedProducts() {
  return (
    <div className="related-products mt-8 md:mt-12">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 px-4 md:px-0">CUSTOMERS WHO VIEWED THIS PRODUCT ALSO VIEWED:</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
        {relatedProducts.map((product) => (
          <Link 
            key={product.id} 
            href={`/products/${product.id}`}
            className="group relative bg-white p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative w-full aspect-square mb-3 md:mb-4">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className="object-contain group-hover:scale-105 transition-transform duration-200"
              />
              {product.discount && (
                <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-tl-lg rounded-br-lg">
                  -{product.discount}%
                </div>
              )}
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-xs md:text-sm mb-1 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base md:text-lg font-bold">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-xs md:text-sm text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              <button 
                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
