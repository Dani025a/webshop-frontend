'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import './breadcrumb.css'

export default function Breadcrumb() {
  const pathname = usePathname()
  const [productName, setProductName] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchProductName = async () => {
      const segments = pathname.split('/').filter(Boolean)
      if (segments[0] === 'product') {
        const productId = segments[1]
        try {
          const response = await fetch(`http://localhost:1002/api/product/${productId}`)
          if (response.ok) {
            const product = await response.json()
            setProductName(product.name)
          }
        } catch (error) {
          console.error('Error fetching product name:', error)
        }
      }
    }

    fetchProductName()
  }, [pathname])

  if (pathname === '/') return null

  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const isProductPage = segments[0] === 'product'
    
    let breadcrumbs = []

    if (isProductPage) {
      // For product pages, we want to show the full hierarchy
      breadcrumbs = [
        { label: 'FRONT PAGE', path: '/' },
        { label: segments[2].toUpperCase().replace(/-/g, ' '), path: `/category/${segments[2]}` },
        { label: segments[3].toUpperCase().replace(/-/g, ' '), path: `/category/${segments[2]}/${segments[3]}` },
        { label: segments[4].toUpperCase().replace(/-/g, ' '), path: `/category/${segments[2]}/${segments[3]}/${segments[4]}` },
        { label: productName || 'Loading...', path: '#', isLast: true }
      ]
    } else if (segments[0] === 'category') {
      // For category pages
      breadcrumbs = [{ label: 'FRONT PAGE', path: '/' }]
      segments.slice(1).forEach((segment, index) => {
        breadcrumbs.push({
          label: segment.toUpperCase().replace(/-/g, ' '),
          path: `/category/${segments.slice(1, index + 2).join('/')}`,
          isLast: index === segments.length - 2
        })
      })
    } else {
      // For other pages
      breadcrumbs = [{ label: 'FRONT PAGE', path: '/' }]
      segments.forEach((segment, index) => {
        breadcrumbs.push({
          label: segment.toUpperCase().replace(/-/g, ' '),
          path: `/${segments.slice(0, index + 1).join('/')}`,
          isLast: index === segments.length - 1
        })
      })
    }
  
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="breadcrumb-wrapper">
      <nav className="breadcrumb-container" aria-label="Breadcrumb">
        <div className="breadcrumb-content">
          {breadcrumbs.map((breadcrumb, index) => (
            <span key={breadcrumb.path} className="breadcrumb-segment">
              {index > 0 && <ChevronRight className="breadcrumb-separator" aria-hidden="true" />}
              {breadcrumb.isLast ? (
                <span className="breadcrumb-item current" aria-current="page">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link href={breadcrumb.path} className="breadcrumb-item">
                  {breadcrumb.label}
                </Link>
              )}
            </span>
          ))}
        </div>
      </nav>
    </div>
  )
}

