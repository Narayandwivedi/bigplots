import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'
import OrderModal from './OrderModal'

const TopDealsSection = () => {
  const [dealProducts, setDealProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const navigate = useNavigate()
  const { addToCart } = useCart()

  // Add mock products for testing
  const mockProducts = [
    {
      _id: 'mock-test-123',
      name: 'Acer Predator Gaming Laptop',
      price: 75000,
      originalPrice: 85000,
      brand: 'Acer',
      category: 'laptops',
      stockQuantity: 5,
      images: ['/lapfinal.webp'],
      seoTitle: 'Acer Predator Gaming Laptop - High Performance',
      description: 'High-performance gaming laptop with RGB lighting'
    },
    {
      _id: 'mock-test-456',
      name: 'Gaming Mechanical Keyboard',
      price: 4500,
      originalPrice: 5500,
      brand: 'Corsair',
      category: 'computer-accessories',
      subCategory: 'keyboard',
      stockQuantity: 8,
      images: ['/keyboard final.webp'],
      seoTitle: 'RGB Mechanical Gaming Keyboard',
      description: 'RGB backlit mechanical keyboard with blue switches'
    },
    {
      _id: 'mock-test-789',
      name: 'Logitech Wireless RGB Gaming Mouse',
      price: 3200,
      originalPrice: 4000,
      brand: 'Logitech',
      category: 'computer-accessories',
      subCategory: 'mouse',
      stockQuantity: 12,
      images: ['/mosue final.webp'],
      seoTitle: 'Logitech Wireless RGB Gaming Mouse',
      description: 'High-precision wireless gaming mouse with RGB lighting'
    },
    {
      _id: 'mock-test-101',
      name: 'Gaming Motherboard',
      price: 18500,
      originalPrice: 22000,
      brand: 'ASUS',
      category: 'pc-parts',
      subCategory: 'motherboard',
      stockQuantity: 6,
      images: ['/motherboard final.webp'],
      seoTitle: 'ASUS ROG Gaming Motherboard',
      description: 'High-end gaming motherboard with RGB lighting and overclocking support'
    }
  ]

  useEffect(() => {
    fetchTopDeals()
  }, [])

  const fetchTopDeals = async () => {
    try {
      setLoading(true)
      
      // Fetch from main categories (laptops and pc-parts)
      const mainCategories = ['laptops', 'pc-parts']
      const allProducts = []
      
      // Fetch products from main categories
      for (const category of mainCategories) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/category/${category}`)
          if (response.ok) {
            const data = await response.json()
            if (data.data && data.data.length > 0) {
              // Add products from each category, more from pc-parts since it has subcategories
              const productsToAdd = category === 'pc-parts' ? data.data.slice(0, 6) : data.data.slice(0, 2)
              allProducts.push(...productsToAdd)
            }
          }
        } catch (err) {
          console.error(`Failed to fetch ${category}:`, err)
        }
      }
      
      // If we have products, randomly select 5-8 and add fake discount prices
      if (allProducts.length > 0) {
        const shuffled = allProducts.sort(() => 0.5 - Math.random())
        const selectedProducts = shuffled.slice(0, Math.min(8, allProducts.length))
        
        // Add fake discount prices to make them look like deals
        const dealsWithDiscounts = selectedProducts.map(product => ({
          ...product,
          originalPrice: product.originalPrice || Math.round(product.price * (1 + (Math.random() * 0.3 + 0.1))), // Add 10-40% to create original price
          // Keep the current price as discounted price
        }))
        
        // Mix real products with mock products for a better showcase
        const finalDeals = [...mockProducts, ...dealsWithDiscounts].slice(0, 8)
        setDealProducts(finalDeals)
      } else {
        // Show mock products for testing when no API products available
        setDealProducts(mockProducts)
      }
    } catch (error) {
      console.error('Error fetching products for deals:', error)
      // Show mock products for testing when API fails
      setDealProducts(mockProducts)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const calculateDiscount = (original, current) => {
    if (!original || original <= current) return 0
    return Math.round(((original - current) / original) * 100)
  }

  const handleProductClick = (product) => {
    // Navigate to product detail page
    const categoryPath = product.category === 'laptops' ? 'laptops' : 'pc-parts'
    navigate(`/${categoryPath}/${product.subCategory}/product/${product.slug || product._id}`)
  }

  const handleAddToCart = (product, e) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    if (product.stockQuantity > 0) {
      addToCart(product);
      toast.success('Added to cart!');
    } else {
      toast.error('Product is out of stock');
    }
  }

  const handleOrderNow = (product, e) => {
    e.stopPropagation(); // Prevent navigation when clicking order now
    setSelectedProduct(product)
    setOrderModalOpen(true)
  }

  const closeOrderModal = () => {
    setOrderModalOpen(false)
    setSelectedProduct(null)
  }

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading top deals...</p>
          </div>
        </div>
      </section>
    )
  }

  // Don't show section if no deals available
  if (dealProducts.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full mb-4">
            <span className="text-white text-sm font-medium">🔥 Limited Time Offer</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">
            Top <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Deals</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exclusive discounts on selected products - Save big on your next purchase!
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {dealProducts.map((product) => {
            const discountPercent = calculateDiscount(product.originalPrice, product.price)
            
            return (
              <div 
                key={product._id} 
                className="group cursor-pointer transition-all duration-300 bg-white rounded-2xl border-2 border-cyan-100 overflow-hidden hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/25 transform hover:scale-105 relative"
                onClick={() => handleProductClick(product)}
              >
                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      -{discountPercent}%
                    </div>
                  </div>
                )}

                {/* Deal Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                    DEAL
                  </div>
                </div>

                {/* Product Image */}
                <div className="h-48 bg-gradient-to-br from-gray-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.seoTitle || product.name}
                      className="max-h-full max-w-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Product'
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 relative z-10">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4">
                  {/* Brand and Category */}
                  <div className="flex items-center gap-1 sm:gap-2 mb-2">
                    <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full font-medium">
                      {product.brand}
                    </span>
                    <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                      {product.category}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-3 group-hover:text-cyan-700 transition-colors text-sm sm:text-lg line-clamp-2 leading-tight">
                    {product.seoTitle || product.name}
                  </h3>

                  {/* Price Section */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      <span className="text-lg sm:text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-1.5 sm:p-2 rounded-lg group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-shadow">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 mb-3">
                    <button
                      onClick={(e) => handleOrderNow(product, e)}
                      disabled={product.stockQuantity === 0}
                      className={`w-full py-2 px-3 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
                        product.stockQuantity > 0
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white cursor-pointer'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {product.stockQuantity > 0 ? 'Order Now' : 'Out of Stock'}
                    </button>
                    
                    {product.stockQuantity > 0 && (
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-full py-2 px-3 rounded-lg font-medium text-xs sm:text-sm transition-colors bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white cursor-pointer"
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L8 13m0 0L5.6 5M8 13v6a2 2 0 002 2h8a2 2 0 002-2v-6M8 13H6m6 8a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                          <span>Add to Cart</span>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      {product.stockQuantity > 0 ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                          <span className="hidden sm:inline">In Stock</span>
                          <span className="sm:hidden">Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1"></div>
                          <span className="text-[10px] sm:text-xs">Out of Stock</span>
                        </span>
                      )}
                    </div>
                    
                    {/* Savings Amount */}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-green-600 font-bold text-xs sm:text-sm">
                        <span className="hidden sm:inline">Save </span>
                        {formatPrice(product.originalPrice - product.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Browse Products Button */}
        {dealProducts.length >= 4 && (
          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/pc-parts')}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="mr-2">🛒</span>
              Browse All Products
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Order Modal */}
      <OrderModal 
        isOpen={orderModalOpen}
        onClose={closeOrderModal}
        product={selectedProduct}
      />
    </section>
  )
}

export default TopDealsSection