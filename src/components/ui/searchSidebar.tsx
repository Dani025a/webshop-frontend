import React from 'react'
import { X, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Product } from '@/types/types'

interface SearchSidebarProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: Product[]
  isSearching: boolean
  getProductLink: (product: Product) => string
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  getProductLink,
}) => {
  const router = useRouter()

  const handleProductClick = (product: Product) => {
    const productLink = getProductLink(product)
    onClose() // Close the sidebar
    router.push(productLink) // Navigate to the product page
  }

  return (
    <div className={`search-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="search-sidebar-header">
        <button onClick={onClose} className="search-sidebar-close" aria-label="Close search">
          <X />
        </button>
        <h2>Search Products</h2>
      </div>
      <div className="search-sidebar-content">
        <div className="search-sidebar-input-wrapper">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-sidebar-input"
          />
          <Search className="search-sidebar-icon" />
        </div>
        {isSearching && <div className="search-sidebar-loading">Searching...</div>}
        {searchResults.length > 0 && (
          <div className="search-sidebar-results">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="search-sidebar-result"
                onClick={() => handleProductClick(product)}
              >
                <Image
                  src={product.images?.[0]?.url || "/placeholder.svg"}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="search-sidebar-result-image"
                />
                <div className="search-sidebar-result-info">
                  <h3>{product.name}</h3>
                  <p>{product.subSubCategory?.name || product.subCategory?.name || product.category?.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchSidebar

