'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, Minus, Plus, Trash2 } from 'lucide-react'
import { Product, Review, MainCategory, SubCategory, SubSubCategory } from '@/types/types'
import { useCart } from '@/contexts/cartContext'
import { useWishlist } from '@/hooks/useWishlist'
import './productCard.css'

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [quantity, setQuantity] = useState(0)
  const { cart, addToCart, removeFromCart } = useCart()
  const { wishlistProducts, addToWishlist, removeFromWishlist, loading: wishlistLoading } = useWishlist()

  if (!product) {
    return null;
  }

  useEffect(() => {
    const cartItem = cart.find(item => item.id === product.id)
    setQuantity(cartItem ? cartItem.quantity : 0)
  }, [cart, product.id])

  useEffect(() => {
    if (wishlistProducts?.products && product?.id) {
      setIsInWishlist(
        wishlistProducts.products.some(item => item.product.id === product.id)
      );
    } else {
      setIsInWishlist(false);
    }
  }, [wishlistProducts, product]);

  const handleWishlistToggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    if (wishlistLoading || !product?.id) return;

    try {
      if (isInWishlist) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  }, [isInWishlist, removeFromWishlist, addToWishlist, product, wishlistLoading]);

  const renderStars = (reviews: Review[] | undefined) => {
    const averageRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`star ${index < Math.floor(averageRating) ? 'filled' : 
                         index < averageRating ? 'half-filled' : ''}`}
      />
    ))
  }

  const formatPrice = (price: number) => {
    return `$${price}`;
  }

  const calculateDiscountedPrice = (price: number, discount: Product['discount']) => {
    if (!discount) return price;
    return price * (1 - discount.percentage / 100);
  }

  const productName = product.name;
  const productImage = product.images && product.images.length > 0 ? product.images[0].url : '/placeholder.svg';
  const productPrice = product.price;
  const discountedPrice = calculateDiscountedPrice(productPrice, product.discount);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product && product.id !== undefined) {
      addToCart(product);
      setQuantity(prev => prev + 1);
    }
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product && product.id !== undefined) {
      removeFromCart(product.id);
      setQuantity(prev => Math.max(0, prev - 1));
    }
  };

  const handleRemoveAllFromCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product && product.id !== undefined) {
      for (let i = 0; i < quantity; i++) {
        removeFromCart(product.id);
      }
      setQuantity(0);
    }
  };

  const getProductLink = () => {
    const mainCategory: MainCategory | undefined = product.subSubCategory?.subCategory?.mainCategory;
    const subCategory: SubCategory | undefined = product.subSubCategory?.subCategory;
    const subSubCategory: SubSubCategory | undefined = product.subSubCategory;
    
    const mainCategoryName = mainCategory?.name || 'uncategorized';
    const subCategoryName = subCategory?.name || 'uncategorized';
    const subSubCategoryName = subSubCategory?.name || 'uncategorized';
    
    return `/product/${product.id}/${mainCategoryName}/${subCategoryName}/${subSubCategoryName}`;
  }

  return (
    <Link href={getProductLink()} className="product-card-link">
      <div className="product-card">
        {product.discount && (
          <div className="discount-badge">
            -{product.discount.percentage}%
          </div>
        )}
        <div className="product-image">
          <Image
            src={productImage}
            alt={productName}
            width={200}
            height={200}
            priority
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          />
        </div>
        <div className="product-info">
          <h3 className="product-title">{productName}</h3>
          <div className="product-rating">
            <div className="stars">
              {renderStars(product.reviews)}
            </div>
            <span className="review-count">({product.reviews?.length || 0})</span>
          </div>
          <div className="product-price">
            {product.discount && (
              <span className="original-price">
                {formatPrice(productPrice)}
              </span>
            )}
            <span className="current-price">
              {formatPrice(discountedPrice)}
            </span>
          </div>
        </div>
        <div className="product-actions" onClick={(e) => e.preventDefault()}>
          {quantity > 0 ? (
            <>
              <div className="cart-controls">
                <button 
                  className="cart-button remove" 
                  onClick={handleRemoveFromCart}
                >
                  <Minus size={16} />
                </button>
                <span className="quantity">{quantity}</span>
                <button 
                  className="cart-button add" 
                  onClick={handleAddToCart}
                >
                  <Plus size={16} />
                </button>
              </div>
              <button 
                className="remove-all-button" 
                onClick={handleRemoveAllFromCart}
                aria-label="Remove all from cart"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          )}
          <button 
            className={`wishlist-button ${isInWishlist ? 'in-wishlist' : ''}`} 
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            disabled={wishlistLoading}
          >
            <Heart className="wishlist-icon" size={24} />
          </button>
        </div>
      </div>
    </Link>
  )
}

