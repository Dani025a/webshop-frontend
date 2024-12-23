'use client'

import { useState, useRef, useEffect } from 'react'
import { Menu, Search, ShoppingCart, UserPlus, User, ChevronRight, ArrowLeft, X, LogOut, Heart, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { MainCategory, SubCategory, SubSubCategory, Product } from '../../types/types'
import { useCart } from '../../contexts/cartContext'
import './navbar.css'
import logo from '../../assets/DGElectronicsLogo.png'
import { useCategories } from '@/hooks/useCategories'
import { useProducts } from '../../hooks/useProducts'
import { useAuth } from '../../contexts/authContext'

interface MenuState {
  level: 'main' | 'sub' | 'subsub'
  activeCategory?: MainCategory
  activeSubCategory?: SubCategory
}

export default function Navbar() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null)
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [menuState, setMenuState] = useState<MenuState>({
    level: 'main'
  })
  const [isSearchSidebarOpen, setIsSearchSidebarOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const { allCategories } = useCategories()
  const pathname = usePathname()
  const { getCartCount, getCartTotal } = useCart()
  const { getAllProducts, loading: isSearching } = useProducts()
  const { user, logout, isAuthenticated } = useAuth()

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
          .slice(0, 5)
        setSearchResults(filteredProducts)
      } catch (error) {
        console.error('Error searching products:', error)
        setSearchResults([])
      }
    } else {
      setSearchResults([])
    }
  }

  const handleProductSelect = (product: Product) => {
    setIsSearchSidebarOpen(false)
    setSearchQuery('')
    setSearchResults([])
    router.push(getProductLink(product))
  }

  const handleMainCategoryClick = (category: MainCategory) => {
    setMenuState({
      level: 'sub',
      activeCategory: category
    })
  }

  const handleSubCategoryClick = (category: MainCategory, subCategory: SubCategory) => {
    setMenuState({
      level: 'subsub',
      activeCategory: category,
      activeSubCategory: subCategory
    })
  }

  const handleBack = () => {
    if (menuState.level === 'subsub') {
      setMenuState({
        level: 'sub',
        activeCategory: menuState.activeCategory
      })
    } else if (menuState.level === 'sub') {
      setMenuState({
        level: 'main'
      })
    }
  }

  const handleLogout = () => {
    logout()
    setIsProfileDropdownOpen(false)
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
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!isMobileCategoriesOpen) {
      setMenuState({ level: 'main' })
    }
  }, [isMobileCategoriesOpen])

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
    const mainCategory = product.subSubCategory?.subCategory?.mainCategory || { name: 'uncategorized' };
    const subCategory = product.subSubCategory?.subCategory || { name: 'uncategorized' };
    const subSubCategory = product.subSubCategory || { name: 'uncategorized' };
    
    const mainCategorySlug = mainCategory.name.toLowerCase().replace(/\s+/g, '-');
    const subCategorySlug = subCategory.name.toLowerCase().replace(/\s+/g, '-');
    const subSubCategorySlug = subSubCategory.name.toLowerCase().replace(/\s+/g, '-');
    
    return `/product/${product.id}/${mainCategorySlug}/${subCategorySlug}/${subSubCategorySlug}`;
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
                      <Link href={getProductLink(product)} onClick={() => handleProductSelect(product)}>
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
              {isAuthenticated() ? (
                <>
                  <Link href="/wishlist" className={`nav-action ${pathname === '/wishlist' ? 'active' : ''}`}>
                    <Heart />
                    <span>WISHLIST</span>
                  </Link>
                  <div className="nav-action profile-dropdown" ref={profileDropdownRef}>
                    <button  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="profile-button">
                      <User />
                      <span>{user?.firstname}</span>
                    </button>
                    {isProfileDropdownOpen && (
                      <div className="profile-dropdown-menu">
                        <Link href="/orders" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                          <Package />
                          <span>My Orders</span>
                        </Link>
                        <Link href="/profile" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                          <User />
                          <span>My Profile</span>
                        </Link>
                        <button onClick={handleLogout} className="dropdown-item">
                          <LogOut />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/signup" className={`nav-action ${pathname === '/signup' ? 'active' : ''}`}>
                    <UserPlus />
                    <span>SIGN UP</span>
                  </Link>
                  <Link href="/login" className={`nav-action ${pathname === '/login' ? 'active' : ''}`}>
                    <User />
                    <span>LOG IN</span>
                  </Link>
                </>
              )}
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
          <button onClick={() => {
            setIsMobileCategoriesOpen(true)
            setMenuState({ level: 'main' })
          }} className="mobile-nav-item">
            <Menu />
            <span>MENU</span>
          </button>
          <button onClick={() => setIsSearchSidebarOpen(true)} className="mobile-nav-item">
            <Search />
            <span>SEARCH</span>
          </button>
          {isAuthenticated() ? (
            <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="mobile-nav-item">
              <User />
              <span>{user?.firstname}</span>
            </button>
          ) : (
            <Link href="/login" className="mobile-nav-item">
              <User />
              <span>LOG IN</span>
            </Link>
          )}
          <Link href="/cart" className="mobile-nav-item">
            <div style={{ position: 'relative' }}>
              <ShoppingCart />
              {getCartCount() > 0 && <span className="cart-count">{getCartCount()}</span>}
            </div>
            <span>{getCartCount() > 0 ? `$${getCartTotal()}` : 'CART'}</span>
          </Link>
        </div>
        {isMobileCategoriesOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              {menuState.level !== 'main' ? (
                <button onClick={handleBack} className="mobile-menu-back">
                  <ArrowLeft className="w-6 h-6 mr-2" />
                  Back
                </button>
              ) : (
                <div className="mobile-menu-title">Menu</div>
              )}
              <button onClick={() => {
                setIsMobileCategoriesOpen(false)
                setMenuState({ level: 'main' })
              }} className="mobile-menu-close">
                <X className="w-6 h-6" />
              </button>
            </div>

            {menuState.level === 'main' && (
              <div className="mobile-menu-items">
                {allCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleMainCategoryClick(category)}
                    className="mobile-menu-item"
                  >
                    <span>{category.name}</span>
                    {category.subCategories.length > 0 && <ChevronRight className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            )}

            {menuState.level === 'sub' && menuState.activeCategory && (
              <div className="mobile-menu-items">
                <div className="mobile-menu-title">{menuState.activeCategory.name}</div>
                <Link
                  href={getCategoryLink(menuState.activeCategory)}
                  className="mobile-menu-see-all"
                  onClick={() => setIsMobileCategoriesOpen(false)}
                >
                  See all in {menuState.activeCategory.name}
                </Link>
                {menuState.activeCategory.subCategories.map((subCategory) => (
                  <button
                    key={subCategory.id}
                    onClick={() => handleSubCategoryClick(menuState.activeCategory!, subCategory)}
                    className="mobile-menu-item"
                  >
                    <span>{subCategory.name}</span>
                    {subCategory.subSubCategories && subCategory.subSubCategories.length > 0 && (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {menuState.level === 'subsub' && menuState.activeCategory && menuState.activeSubCategory && (
              <div className="mobile-menu-items">
                <div className="mobile-menu-title">{menuState.activeSubCategory.name}</div>
                <Link
                  href={getCategoryLink(menuState.activeCategory, menuState.activeSubCategory)}
                  className="mobile-menu-see-all"
                  onClick={() => setIsMobileCategoriesOpen(false)}
                >
                  See all in {menuState.activeSubCategory.name}
                </Link>
                {menuState.activeSubCategory.subSubCategories?.map((subSubCategory) => (
                  <Link
                    key={subSubCategory.id}
                    href={getCategoryLink(menuState.activeCategory!, menuState.activeSubCategory!, subSubCategory)}
                    className="mobile-menu-item"
                    onClick={() => setIsMobileCategoriesOpen(false)}
                  >
                    <span>{subSubCategory.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        {isSearchSidebarOpen && (
          <div className="search-sidebar open">
            <div className="search-sidebar-header">
              <h2>Search Products</h2>
              <button onClick={() => setIsSearchSidebarOpen(false)} className="search-sidebar-close">
                <X />
              </button>
            </div>
            <div className="search-sidebar-content">
              <div className="search-sidebar-input-wrapper">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="search-sidebar-input"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  aria-label="Search products"
                />
                <Search className="search-sidebar-icon" />
              </div>
              {isSearching && (
                <div className="search-sidebar-loading" aria-live="polite">
                  Searching...
                </div>
              )}
              {searchResults.length > 0 && (
                <div className="search-sidebar-results" role="listbox">
                  {searchResults.map((product) => (
                    <div key={product.id} className="search-sidebar-result-item" role="option">
                      <Link href={getProductLink(product)} onClick={() => handleProductSelect(product)}>
                        <Image 
                          src={product.images?.[0]?.url || "/placeholder.svg"}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="search-sidebar-result-image"
                        />
                        <div className="search-sidebar-result-info">
                          <h3>{product.name}</h3>
                          <p>{product.subSubCategory?.name || product.subCategory?.name || product.category?.name}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {isProfileDropdownOpen && (
          <div className="mobile-profile-dropdown">
            <div className="mobile-profile-email">
              <span>{user?.email}</span>
              <button 
                onClick={() => setIsProfileDropdownOpen(false)} 
                className="mobile-profile-close"
              >
                <X />
              </button>
            </div>
            <Link href="/orders" className="mobile-dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
              <Package />
              <span>My Orders</span>
            </Link>
            <Link href="/wishlist" className="mobile-dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
              <Heart />
              <span>Wishlist</span>
            </Link>
            <Link href="/profile" className="mobile-dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
              <User />
              <span>My Profile</span>
            </Link>
            <button onClick={handleLogout} className="mobile-dropdown-item">
              <LogOut />
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>
    </>
  )
}

