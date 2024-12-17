'use client'

import { useState, useRef, useEffect } from 'react'
import { Menu, Search, ShoppingCart, UserPlus, User, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { MainCategory, SubCategory, SubSubCategory, Product } from '../../types/types'
import { searchProducts } from '../../utils/mockProductSearch'
import { useCart } from '../../contexts/cartContext'
import './navbar.css'
import logo from '../../assets/DGElectronicsLogo.png'
import { useCategories } from '@/hooks/useCategories'

export default function Navbar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null)
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const { allCategories } = useCategories()
  const pathname = usePathname()
  const { getCartCount, getCartTotal, addToCart } = useCart()

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
      setIsSearching(true)
      const results = await searchProducts(query)
      setSearchResults(results)
      setIsSearching(false)
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
    let parts = ['/category', mainCategory.name]
    if (subCategory) {
      parts.push(subCategory.name)
      if (subSubCategory) {
        parts.push(subSubCategory.name)
      }
    }
    return parts.map(part => part.toLowerCase().replace(/\s+/g, '-')).join('/')
  }

  const getProductLink = (product: Product) => {
    const mainCategory: MainCategory | undefined = product.subSubCategory?.subCategory?.mainCategory;
    const subCategory: SubCategory | undefined = product.subSubCategory?.subCategory;
    const subSubCategory: SubSubCategory | undefined = product.subSubCategory;
    
    const mainCategoryName = mainCategory?.name || 'uncategorized';
    const subCategoryName = subCategory?.name || 'uncategorized';
    const subSubCategoryName = subSubCategory?.name || 'uncategorized';
    const productName = product.name.toLowerCase().replace(/\s+/g, '-');
    
    return `/product/${productName}/${mainCategoryName}/${subCategoryName}/${subSubCategoryName}`;
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
                placeholder="SEARCH..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button className="search-button" aria-label="Search">
                <Search className="search-icon" />
              </button>
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((product) => (
                    <div key={product.id} className="search-result-item">
                      <Link href={getProductLink(product)}>
                        <Image 
                          src={product.images?.[0]?.url || "/placeholder.svg"}
                          alt={product.name}
                          width={50}
                          height={50}
                        />
                        <div className="search-result-info">
                          <h3>{product.name}</h3>
                          <p>{product.subSubCategory?.name}</p>
                        </div>
                      </Link>
                      <button onClick={() => addToCart(product)} className="add-to-cart-button">
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {isSearching && <div className="search-loading">Searching...</div>}
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
                
                {activeCategory === category.name && category.subCategories && (
                  <div 
                    className="mega-menu" 
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
                )}
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

