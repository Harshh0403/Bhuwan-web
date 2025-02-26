import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, Search, Heart, Eye, X } from "lucide-react";
import ProductModal from "./ProductModal"; // Import the modal component
import "../styles/product-page.css";

export default function ProductPage() {
  // State declarations
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(new Map());
  const [wishlist, setWishlist] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [showQuickView, setShowQuickView] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showFloatingCart, setShowFloatingCart] = useState(false); // Define showFloatingCart state

  // Ref declarations
  const headerRef = useRef(null);
  const categoriesRef = useRef(null);

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const categoriesWithImages = data.map((category) => ({
          ...category,
          image: category.image || "/placeholder.svg",
        }));
        setCategories(categoriesWithImages);
        if (categoriesWithImages.length > 0) setSelectedCategory(categoriesWithImages[0]);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Fetch products based on selected category
  useEffect(() => {
    if (selectedCategory) {
      fetch(`http://localhost:5000/api/products?category=${selectedCategory._id}`)
        .then((res) => res.json())
        .then((data) => setProducts(data));
    }
  }, [selectedCategory]);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const categoriesHeight = categoriesRef.current?.offsetHeight || 0;
      setShowFloatingCart(window.scrollY > headerHeight + categoriesHeight);

      if (categoriesRef.current) {
        if (window.scrollY > headerHeight) {
          categoriesRef.current.style.position = "fixed";
          categoriesRef.current.style.top = "0";
          categoriesRef.current.style.left = "0";
          categoriesRef.current.style.right = "0";
          categoriesRef.current.style.zIndex = "40";
          document.body.style.paddingTop = `${categoriesHeight}px`;
        } else {
          categoriesRef.current.style.position = "static";
          document.body.style.paddingTop = "0";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add product to cart
  const handleAddToCart = (product) => {
    if (!product.inStock) {
      alert("This product is out of stock!");
      return;
    }
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      const item = newCart.get(product._id);
      if (item) {
        newCart.set(product._id, { ...item, quantity: item.quantity + 1 });
      } else {
        newCart.set(product._id, { ...product, quantity: 1 });
      }
      return newCart;
    });
  };

  // Toggle product in wishlist
  const toggleWishlist = (productId) => {
    setWishlist((prevWishlist) => {
      const newWishlist = new Set(prevWishlist);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render product grid
  const renderProductGrid = () => {
    return filteredProducts.map((product) => {
      // Check if the image is a URL or a local file path
      const imageUrl = product.image.startsWith("http") // Check if it's a URL
        ? product.image // Use the URL directly
        : `http://localhost:5000${product.image}`; // Prepend backend URL for local files

      return (
        <div key={product._id} className="product-card">
          <div className="product-image-container">
            <img
              src={imageUrl || "/placeholder.png"} // Use the constructed URL
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.src = "/placeholder.png"; // Fallback if the image fails to load
              }}
            />
            <div className="product-actions">
              <button
                onClick={() => toggleWishlist(product._id)}
                className={`wishlist-button ${wishlist.has(product._id) ? "in-wishlist" : ""}`}
              >
                <Heart className="action-icon" />
              </button>
              <button onClick={() => setShowQuickView(product)} className="quickview-button">
                <Eye className="action-icon" />
              </button>
            </div>
          </div>
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price.toFixed(2)}</p>
            {/* Show "Out of Stock" only if the product is out of stock */}
            {!product.inStock && (
              <p className="out-of-stock">Out of Stock</p>
            )}
            <button
              onClick={() => handleAddToCart(product)}
              className="add-to-cart-button"
              disabled={!product.inStock}
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f5f1]">
      {/* Categories Navigation */}
      <nav ref={categoriesRef} className="categories-nav">
        <div className="container">
          <div className="nav-content">
            <div className="categories-scroll">
              {categories.map((category) => (
                <button
                  key={category._id}
                  className={`category-button ${selectedCategory?._id === category._id ? "selected" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="category-image-container">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="category-image"
                    />
                  </div>
                  {category.name}
                </button>
              ))}
            </div>
            <div className="search-cart">
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button onClick={() => setShowCart(true)} className="cart-button">
                <ShoppingCart className="cart-icon" />
                {cart.size > 0 && <span className="cart-count">{cart.size}</span>}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Product List */}
      <main className="main-content">
        <div className="container">
          <h2 className="section-title">{selectedCategory?.name || "Products"}</h2>
          <div className="product-grid">{renderProductGrid()}</div>
        </div>
      </main>

      {/* Product Modal */}
      {showQuickView && (
        <ProductModal
          product={showQuickView}
          onClose={() => setShowQuickView(null)}
          handleAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
