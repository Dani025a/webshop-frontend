'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useProducts } from '@/hooks/useProducts'
import { Product } from '@/types/types'
import './home.css'

export function HomePage() {
  const { getAllProducts } = useProducts()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getProductUrl = (product: Product) => {
    const mainCategory = product.subSubCategory?.subCategory?.mainCategory?.name || 'Uncategorized'
    const subCategory = product.subSubCategory?.subCategory?.name || 'Uncategorized'
    const subSubCategory = product.subSubCategory?.name || 'Uncategorized'
    return `/product/${product.id}/${encodeURIComponent(mainCategory)}/${encodeURIComponent(subCategory)}/${encodeURIComponent(subSubCategory)}`
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const allProducts = await getAllProducts()
        setFeaturedProducts(allProducts.slice(0, 4))
        setLoading(false)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to fetch products')
        setLoading(false)
      }
    }

    fetchProducts()
  }, [getAllProducts])

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <section className="py-8 md:py-12 lg:py-20">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800">Welcome to DG Electronics</h1>
            <p className="text-lg sm:text-xl mb-6 text-gray-600">Discover the latest in technology and gadgets.</p>
            <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors inline-block text-center w-full sm:w-auto">
              Shop Now
            </Link>
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Electronics showcase"
              width={600}
              height={400}
              className="rounded-lg shadow-lg hero-image w-full h-auto"
            />
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Featured Products</h2>
        {loading && <p className="text-center text-gray-600">Loading products...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <Link href={getProductUrl(product)} key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden featured-product-card transform transition duration-300 hover:scale-105">
                <div className="featured-product-image-container">
                  <Image
                    src={product.images?.[0]?.url || '/placeholder.svg?height=300&width=300'}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="featured-product-image"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
                  <p className="text-gray-600">${product.price}</p>
                  <div className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full text-center">
                    View Details
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <section className="py-8 md:py-12 bg-gray-100 rounded-lg my-8 md:my-12">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">Join Our Newsletter</h2>
          <p className="text-lg sm:text-xl mb-6 text-gray-600">Stay updated with the latest products and exclusive offers.</p>
          <form className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 rounded-md sm:rounded-r-none border border-gray-300 focus:outline-none newsletter-input mb-2 sm:mb-0"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md sm:rounded-l-none hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

