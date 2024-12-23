'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import './breadcrumb.css'

export default function Breadcrumb() {
  const pathname = usePathname()
  const [productName, setProductName] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
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

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth
    }
  }, [pathname, productName])

  if (pathname === '/') return null

  const formatSegment = (str: string, forUrl = false) => {
    const decoded = decodeURIComponent(str);
    const hyphenated = decoded.replace(/\s+/g, '-');
    return forUrl ? hyphenated.toLowerCase() : hyphenated.toUpperCase();
  };

  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const isProductPage = segments[0] === 'product'
    
    let breadcrumbs = []

    if (isProductPage) {
      breadcrumbs = [
        { label: 'FRONT PAGE', path: '/' },
        { label: formatSegment(segments[2]), path: `/category/${formatSegment(segments[2], true)}` },
        { label: formatSegment(segments[3]), path: `/category/${formatSegment(segments[2], true)}/${formatSegment(segments[3], true)}` },
        { label: formatSegment(segments[4]), path: `/category/${formatSegment(segments[2], true)}/${formatSegment(segments[3], true)}/${formatSegment(segments[4], true)}` },
        { label: productName || 'Loading...', path: '#', isLast: true }
      ]
    } else if (segments[0] === 'category') {
      breadcrumbs = [{ label: 'FRONT PAGE', path: '/' }]
      segments.slice(1).forEach((segment, index) => {
        breadcrumbs.push({
          label: formatSegment(segment),
          path: `/category/${segments.slice(1, index + 2).map(s => formatSegment(s, true)).join('/')}`,
          isLast: index === segments.length - 2
        })
      })
    } else {
      breadcrumbs = [{ label: 'FRONT PAGE', path: '/' }]
      segments.forEach((segment, index) => {
        breadcrumbs.push({
          label: formatSegment(segment),
          path: `/${segments.slice(0, index + 1).map(s => formatSegment(s, true)).join('/')}`,
          isLast: index === segments.length - 1
        })
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="breadcrumb-wrapper" ref={scrollContainerRef}>
      <nav className="breadcrumb-container" aria-label="Breadcrumb">
        <div className="breadcrumb-content">
          {breadcrumbs.map((breadcrumb, index) => (
            <span key={breadcrumb.path} className="breadcrumb-segment">
              {index > 0 && <ChevronRight className="breadcrumb-separator" aria-hidden="true" />}
              {breadcrumb.isLast ? (
                <span className="breadcrumb-item current" aria-current="page" title={breadcrumb.label}>
                  {breadcrumb.label}
                </span>
              ) : (
                <Link href={breadcrumb.path} className="breadcrumb-item" title={breadcrumb.label}>
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

