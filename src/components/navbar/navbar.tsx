'use client'

import { useState, useRef, useEffect } from 'react'
import { Menu, Search, ShoppingCart, UserPlus, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { MainCategory, SubCategory, SubSubCategory, Product } from '../../types/types'
import { useCart } from '../../contexts/cartContext'
import './navbar.css'
import logo from '../../assets/DGElectronicsLogo.png'
import { useCategories } from '@/hooks/useCategories'
import { useProducts } from '../../hooks/useProducts'

export default function Navbar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null)
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const { allCategories } = useCategories()
  const pathname = usePathname()
  const { getCartCount, getCartTotal, addToCart } = useCart()
  const { getAllProducts, loading: isSearching } = useProducts()

  const handleCategoryHover = (categoryName: string) => {
    setActiveCategory(categoryName)
  }

  const handleSubCategoryHover = (subCategoryName: string) => {
    setActiveSubCategory(subCategoryName)
  }

  const handleMouseLeave = (event: React.MouseEvent) => {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!megaMenuRef.current?.contains(relatedTarget) && !relatedTarget?.closest('.category-item')) {
      setActiveCategory(null);
      setActiveSubCategory(null);
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      try {
        const allProducts = await getAllProducts()
        const filteredProducts = allProducts
          .filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description?.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5) // Limit to 5 products
        setSearchResults(filteredProducts)
      } catch (error) {
        console.error('Error searching products:', error)
        setSearchResults([])
      }
    } else {
      setSearchResults([])
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setActiveCategory(null)
        setActiveSubCategory(null)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getCategoryLink = (mainCategory: MainCategory, subCategory?: SubCategory, subSubCategory?: SubSubCategory) => {
    let parts = ['/category', mainCategory.name.toLowerCase().replace(/\s+/g, '-')]
    if (subCategory) {
      parts.push(subCategory.name.toLowerCase().replace(/\s+/g, '-'))
      if (subSubCategory) {
        parts.push(subSubCategory.name.toLowerCase().replace(/\s+/g, '-'))
      }
    }
    return parts.join('/')
  }

  const getProductLink = (product: Product) => {
    const mainCategory: MainCategory | undefined = product.subSubCategory?.subCategory?.mainCategory;
    const subCategory: SubCategory | undefined = product.subSubCategory?.subCategory;
    const subSubCategory: SubSubCategory | undefined = product.subSubCategory;
    
    const mainCategoryName = mainCategory?.name || 'uncategorized';
    const subCategoryName = subCategory?.name || 'uncategorized';
    const subSubCategoryName = subSubCategory?.name || 'uncategorized';
    
    return `/product/${product.id}/${mainCategoryName}/${subCategoryName}/${subSubCategoryName}`;
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-top">
            <Link href="/" className="logo">
              <Image 
                src={logo}
                alt="DG Electronics" 
                height={60}
                priority
              />           
            </Link>         
            <div className="search-container" ref={searchRef}>
              <input 
                type="text" 
                placeholder="Search products..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                aria-label="Search products"
              />
              <button className="search-button" aria-label="Submit search">
                <Search className="search-icon" />
              </button>
              {searchResults.length > 0 && (
                <div className="search-results" role="listbox">
                  {searchResults.map((product) => (
                    <div key={product.id} className="search-result-item" role="option">
                      <Link href={getProductLink(product)}>
                        <Image 
                          src={product.images?.[0]?.url || "/placeholder.svg"}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="search-result-image"
                        />
                        <div className="search-result-info">
                          <h3>{product.name}</h3>
                          <p>{product.subSubCategory?.name || product.subCategory?.name || product.category?.name}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              {isSearching && (
                <div className="search-loading" aria-live="polite">
                  Searching...
                </div>
              )}
            </div>
            <div className="nav-actions">
              <Link href="/signup" className={`nav-action ${pathname === '/signup' ? 'active' : ''}`}>
                <UserPlus />
                <span>SIGN UP</span>
              </Link>
              <Link href="/login" className={`nav-action ${pathname === '/login' ? 'active' : ''}`}>
                <User />
                <span>LOG IN</span>
              </Link>
              <Link href="/cart" className={`nav-action ${pathname === '/cart' ? 'active' : ''}`}>
                <ShoppingCart />
                <span>{getCartCount() > 0 ? `$${getCartTotal()}` : 'CART'}</span>
                {getCartCount() > 0 && <span className="cart-count">{getCartCount()}</span>}
              </Link>
            </div>
          </div>

          <div className="nav-categories">
            {allCategories.map((category: MainCategory) => (
              <div
                key={category.id}
                className={`category-item ${activeCategory === category.name ? 'active' : ''}`}
                onMouseEnter={() => handleCategoryHover(category.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link href={getCategoryLink(category)}>
                  {category.name}
                </Link>
                
                <div 
                  className={`mega-menu ${activeCategory === category.name ? 'active' : ''}`}
                  ref={megaMenuRef} 
                  onMouseEnter={() => setActiveCategory(category.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="mega-menu-content">
                    {category.subCategories.map((subcategory: SubCategory) => (
                      <div 
                        key={subcategory.id} 
                        className={`mega-menu-column ${activeSubCategory === subcategory.name ? 'active' : ''}`}
                        onMouseEnter={() => handleSubCategoryHover(subcategory.name)}
                      >
                        <Link 
                          href={getCategoryLink(category, subcategory)}
                          className="mega-menu-title"
                        >
                          {subcategory.name}
                        </Link>
                        {subcategory.subSubCategories && (
                          <ul className="mega-menu-list">
                            {subcategory.subSubCategories.map((subsubcategory: SubSubCategory) => (
                              <li key={subsubcategory.id}>
                                <Link 
                                  href={getCategoryLink(category, subcategory, subsubcategory)}
                                >
                                  {subsubcategory.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>
      <nav className="mobile-nav">
        <div className="mobile-nav-items">
          <button onClick={() => setIsMobileCategoriesOpen(true)} className="mobile-nav-item">
            <Menu />
            <span>MENU</span>
          </button>
          <Link href="/search" className="mobile-nav-item">
            <Search />
            <span>SEARCH</span>
          </Link>
          <Link href="/login" className="mobile-nav-item">
            <User />
            <span>LOG IN</span>
          </Link>
          <Link href="/cart" className="mobile-nav-item">
            <ShoppingCart />
            <span>CART</span>
            {getCartCount() > 0 && <span className="cart-count">{getCartCount()}</span>}
          </Link>
        </div>
      </nav>
    </>
  )
}

