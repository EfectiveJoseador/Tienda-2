import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage if available
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('footballShirtsCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });
  
  // Update localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('footballShirtsCart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);
  
  // Add item to cart
  const addToCart = (item) => {
    setCart(prevCart => {
      // Check if item already exists in cart with same size
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.id === item.id && cartItem.selectedSize === item.selectedSize
      );
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return updatedCart;
      } else {
        // Item does not exist, add to cart
        return [...prevCart, item];
      }
    });
  };
  
  // Update cart item quantity
  const updateCartItemQuantity = (item, newQuantity) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        // If quantity is zero or less, remove item
        return prevCart.filter(
          cartItem => !(cartItem.id === item.id && cartItem.selectedSize === item.selectedSize)
        );
      } else {
        // Update quantity
        return prevCart.map(cartItem => {
          if (cartItem.id === item.id && cartItem.selectedSize === item.selectedSize) {
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        });
      }
    });
  };
  
  // Remove item from cart
  const removeFromCart = (item) => {
    setCart(prevCart => 
      prevCart.filter(
        cartItem => !(cartItem.id === item.id && cartItem.selectedSize === item.selectedSize)
      )
    );
  };
  
  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
  };
  
  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      updateCartItemQuantity, 
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;