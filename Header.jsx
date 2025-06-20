import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from './CartContext';

function Header() {
  const { cart } = useContext(CartContext);
  
  // Calculate total number of items in cart
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-azul-primario text-white shadow-lg relative z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-azul-acento transition flex items-center">
          <span className="mr-2">CAMISETAZO</span>
          <span className="text-xs font-normal bg-azul-acento px-2 py-1 rounded">PREMIUM</span>
        </Link>
        
        <nav className="flex items-center space-x-8">
          <Link to="/" className="hover:text-azul-acento transition">
            Inicio
          </Link>
          
          <Link to="/cart" className="relative hover:text-azul-acento transition">
            <div className="flex items-center">
              <span className="mr-1">Carrito</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-azul-acento text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;