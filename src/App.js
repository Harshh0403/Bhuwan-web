import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./customer/components/navigation/navigation";
import Home from "./customer/components/home";
import ProductPage from "./customer/components/product-page";
import AdminPanel from "./customer/components/admin-panel";
import Contact from "./customer/components/contact";
import About from "./customer/components/aboutus";
import CheckoutPage from "./customer/components/CheckoutPage"; // Import CheckoutPage

function App() {
  const [cart, setCart] = useState(new Map());

  const calculateTotal = () => {
    let total = 0;
    Array.from(cart.values()).forEach((item) => {
      total += item.price * item.quantity;
    });
    return total.toFixed(2);
  };

  const handleUpdateQuantity = (productId, quantity) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      const item = newCart.get(productId);
      if (item && quantity > 0) {
        newCart.set(productId, { ...item, quantity });
      } else {
        newCart.delete(productId);
      }
      return newCart;
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      newCart.delete(productId);
      return newCart;
    });
  };

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* Home page route */}
          <Route path="/" element={<Home />} />

          {/* Product page route */}
          <Route path="/products" element={<ProductPage cart={cart} setCart={setCart} />} />

          {/* Checkout page route */}
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                calculateTotal={calculateTotal}
                handleUpdateQuantity={handleUpdateQuantity}
                handleRemoveFromCart={handleRemoveFromCart}
              />
            }
          />

          {/* Admin Panel route */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* Contact page route */}
          <Route path="/contact" element={<Contact />} />

          {/* About Us page route */}
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
