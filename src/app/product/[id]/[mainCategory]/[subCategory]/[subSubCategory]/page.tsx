'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Star, Heart, ChevronUp, ChevronDown, Plus, Minus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '@/contexts/cartContext'
import { useProducts } from '@/hooks/useProducts'
import { useWishlist } from '@/hooks/useWishlist'
import { Product } from '@/types/types'
import './productInformation.css'
import SpecificationsTable from '@/components/products/specificationsTable/specificationsTable'
import RelatedProducts from '@/components/products/relatedProducts/relatedProducts'

export default function ProductInformation() {
  const [selectedImage, setSelectedImage] = useState(0)
  const { cart, addToCart, removeFromCart } = useCart()
  const { products, loading, error, fetchSingleProduct } = useProducts()
  const { wishlistProducts, addToWishlist, removeFromWishlist, loading: wishlistLoading } = useWishlist()
  const [productInformation, setProductInformation] = useState<Product | null>(null)
  const params = useParams()
  const [startIndex, setStartIndex] = useState(0)
  const visibleThumbnails = 5

  useEffect(() => {
    const fetchProduct = async () => {
      if (params.id) {
        try {
          await fetchSingleProduct(Number(params.id))
        } catch (err) {
          console.error('Error fetching product:', err)
        }
      }
    }

    fetchProduct()
  }, [params.id, fetchSingleProduct])

  useEffect(() => {
    if (products.length > 0) {
      setProductInformation(products[0])
      setStartIndex(0)
      setSelectedImage(0)
    }
  }, [products])

  useEffect(() => {
    const handleResize = () => {
      setStartIndex(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!productInformation) return <div>Product not found</div>

  const cartItem = cart.find(item => item.id === productInformation.id)
  const quantity = cartItem ? cartItem.quantity : 0

  const isInWishlist = wishlistProducts?.products.some(item => item.product.id === productInformation.id) || false

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index)
  }

  const handleWishlistToggle = async () => {
    if (wishlistLoading || !productInformation.id) return;

    try {
      if (isInWishlist) {
        await removeFromWishlist(productInformation.id);
      } else {
        await addToWishlist(productInformation);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0 && newQuantity <= productInformation.stock) {
      if (newQuantity === 0) {
        removeFromCart(productInformation.id!)
      } else {
        addToCart({ ...productInformation, stock: newQuantity })
      }
    }
  }

  const handleAddToCart = () => {
    if (quantity < productInformation.stock) {
      addToCart({ ...productInformation, stock: quantity + 1 })
    }
  }

  const handleRemoveAllFromCart = () => {
    if (quantity > 0) {
      for (let i = 0; i < quantity; i++) {
        removeFromCart(productInformation.id!)
      }
    }
  }

  const calculateDiscountedPrice = (price: number, discount: Product['discount']) => {
    if (!discount) return price;
    return price * (1 - discount.percentage / 100);
  }

  const averageRating = productInformation.reviews ? 
    productInformation.reviews.reduce((sum, review) => sum + review.rating, 0) / productInformation.reviews.length : 0

  const getStockStatus = (stock: number) => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 5) return 'low-stock';
    return '';
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return 'OUT OF STOCK';
    if (stock <= 5) return `${stock} LEFT - LOW STOCK`;
    return `${stock} - IN STOCK`;
  };

  const renderThumbnails = () => {
    if (!productInformation.images || productInformation.images.length === 0) {
      return null;
    }
    
    const isMobile = window.innerWidth <= 768;
    
    if (productInformation.images.length <= 4) {
      return (
        <div className="product-information-thumbnail-navigation">
          {productInformation.images.map((image, index) => (
            <button
              key={image.id}
              className={`product-information-thumbnail ${selectedImage === index ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
            >
              <Image
                src={image.url}
                alt={`${productInformation.name} thumbnail ${index + 1}`}
                width={80}
                height={80}
              />
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="product-information-thumbnail-navigation">
        <button
          className="product-information-thumbnail-nav-button"
          onClick={() => setStartIndex((prevIndex) => (prevIndex - 1 + productInformation.images.length) % productInformation.images.length)}
        >
          {isMobile ? <ChevronLeft size={24} /> : <ChevronUp size={24} />}
        </button>
        {[...Array(visibleThumbnails)].map((_, index) => {
          const imageIndex = (startIndex + index) % productInformation.images.length
          const image = productInformation.images[imageIndex]
          return (
            <button
              key={`${image.id}-${index}`}
              className={`product-information-thumbnail ${selectedImage === imageIndex ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(imageIndex)}
            >
              <Image
                src={image.url}
                alt={`${productInformation.name} thumbnail ${imageIndex + 1}`}
                width={80}
                height={80}
              />
            </button>
          )
        })}
        <button
          className="product-information-thumbnail-nav-button"
          onClick={() => setStartIndex((prevIndex) => (prevIndex + 1) % productInformation.images.length)}
        >
          {isMobile ? <ChevronRight size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>
    );
  };

  return (
    <div className="product-information">
      <div className="product-information-gallery">
        <div className="product-information-thumbnail-container">
          {renderThumbnails()}
        </div>
        <div className="product-information-main-image">
          {productInformation.discount && (
            <div className="product-information-discount-badge">
              -{productInformation.discount.percentage}%
            </div>
          )}
          <Image
            src={productInformation.images?.[selectedImage]?.url || '/placeholder.svg'}
            alt={productInformation.name}
            width={600}
            height={600}
            priority
          />
        </div>
      </div>
      <div className="product-information-details">
        <h1 className="product-information-title">{productInformation.name}</h1>
        <p className="product-information-subtitle">{productInformation.description}</p>
        <div className="product-information-rating">
          <div className="product-information-stars">
            {Array(5).fill(0).map((_, index) => (
              <Star
                key={index}
                className={`product-information-star ${index < Math.floor(averageRating) ? 'filled' : ''}`}
              />
            ))}
          </div>
          <span className="product-information-review-count">({productInformation.reviews?.length || 0})</span>
        </div>
        <div className="product-information-price">
        {productInformation.discount ? (
          <>
            <span className="product-information-current-price">
              ${calculateDiscountedPrice(productInformation.price, productInformation.discount)}
            </span>
            <span className="product-information-original-price">
              ${productInformation.price}
            </span>
          </>
        ) : (
          <span className="product-information-current-price">
            ${productInformation.price}
          </span>
        )}
      </div>
        <div className={`product-information-stock-status ${getStockStatus(productInformation.stock)}`}>
          <span className="product-information-stock-indicator"></span>
          {getStockText(productInformation.stock)}
        </div>
        <div className="product-information-actions">
          {quantity > 0 ? (
            <>
              <div className="product-information-cart-controls">
                <button 
                  className="product-information-cart-button remove" 
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  <Minus size={16} />
                </button>
                <span className="product-information-quantity">{quantity}</span>
                <button 
                  className="product-information-cart-button add" 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= productInformation.stock}
                >
                  <Plus size={16} />
                </button>
              </div>
              <button 
                className="product-information-remove-all-button" 
                onClick={handleRemoveAllFromCart}
                aria-label="Remove all from cart"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <button className="product-information-add-to-cart" onClick={handleAddToCart}>
              ADD TO CART
            </button>
          )}
          <button 
            className={`product-information-wishlist-button ${isInWishlist ? 'in-wishlist' : ''}`}
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            disabled={wishlistLoading}
          >
            <Heart className="product-information-wishlist-icon" />
          </button>
        </div>
      </div>
      <RelatedProducts />
      <div className="product-specifications">
        <SpecificationsTable filters={productInformation.filters || []} />
      </div>
    </div>
  )
}

