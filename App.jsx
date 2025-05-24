import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import Header from './Header';
import ProductList from './ProductList';
import Cart from './Cart';
import Checkout from './Checkout';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-degradado-fondo flex flex-col text-white relative">
          <div className="absolute inset-0 bg-opacity-10 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-10 animate-pulse"></div>
          </div>
          <Header />
          <main className="flex-grow relative z-10">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
          <footer className="bg-azul-primario text-white py-6 relative z-10">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Camisetazo</h3>
                  <p className="text-gray-300 text-sm">
                    El destino definitivo para los aficionados al fútbol donde encontrar camisetas oficiales de equipos de todo el mundo.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Enlaces Rápidos</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li><a href="/" className="hover:text-azul-acento transition">Inicio</a></li>
                    <li><a href="/cart" className="hover:text-azul-acento transition">Carrito</a></li>
                    <li><a href="#" className="hover:text-azul-acento transition">Sobre Nosotros</a></li>
                    <li><a href="#" className="hover:text-azul-acento transition">Contacto</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contáctanos</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>Email: camisetazocontacto@gmail.com</li>
                    <li>Instagram: @camisetazo._</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
                <p>© 2025 Camisetazo. Todos los derechos reservados.</p>
              </div>
            </div>
          </footer>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;