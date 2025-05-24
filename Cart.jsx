import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from './CartContext';

function Cart() {
  const { cart, updateCartItemQuantity, removeFromCart } = useContext(CartContext);

  // Calculate subtotal with volume discounts
  const calculateItemPrice = (item) => {
    const extra = item.selectedSize === '3XL' ? 2 : 0;
    const basePrice = item.price + extra;
    if (item.quantity >= 5) {
      return basePrice * item.quantity * 0.80; // 20% discount for 5 or more
    } else if (item.quantity >= 3) {
      return basePrice * item.quantity * 0.90; // 10% discount for 3 or more
    }
    return basePrice * item.quantity;
  };

  const subtotal = cart.reduce((total, item) => {
    return total + calculateItemPrice(item);
  }, 0);

  // Calculate total savings
  const regularTotal = cart.reduce((total, item) => {
    const extra = item.selectedSize === '3XL' ? 2 : 0;
    return total + (item.price + extra) * item.quantity;
  }, 0);
  const savings = regularTotal - subtotal;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Carrito de Compra</h1>
        <div className="bg-azul-secundario bg-opacity-90 rounded-lg shadow-md p-6 text-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-100 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-xl text-gray-200 mb-6">Tu carrito está vacío</p>
          <Link to="/" className="bg-azul-acento text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-azul-primario transition duration-300">
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Carrito de Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-azul-secundario bg-opacity-90 rounded-lg shadow-md overflow-hidden text-white">
            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="border-b border-azul-primario last:border-b-0">
                <div className="flex flex-col sm:flex-row p-4 gap-4">
                  <div className="w-24 h-24 bg-azul-acento rounded flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100x100?text=Camiseta';
                      }} 
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-300 mb-1">Talla: {item.selectedSize}</p>
                    <div className="mb-3">
                      <p className="font-bold text-white">
                        {calculateItemPrice(item).toFixed(2)}€
                        {item.quantity >= 3 && (
                          <span className="ml-2 text-xs bg-azul-acento text-white px-2 py-1 rounded">
                            {item.quantity >= 5 ? '20% DESCUENTO' : '10% DESCUENTO'}
                          </span>
                        )}
                      </p>
                      {item.quantity >= 3 && (
                        <p className="text-xs line-through text-gray-400">
                          Precio regular: {(item.price + (item.selectedSize === '3XL' ? 2 : 0)) * item.quantity}€
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        onClick={() => updateCartItemQuantity(item, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-azul-acento flex items-center justify-center hover:bg-azul-acento hover:text-white transition"
                        disabled={item.quantity <= 1}
                      >
                        <span className="text-lg font-medium">-</span>
                      </button>
                      
                      <span className="mx-3 min-w-[2rem] text-center">{item.quantity}</span>
                      
                      <button
                        onClick={() => updateCartItemQuantity(item, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-azul-acento flex items-center justify-center hover:bg-azul-acento hover:text-white transition"
                      >
                        <span className="text-lg font-medium">+</span>
                      </button>
                      
                      <button
                        onClick={() => removeFromCart(item)}
                        className="ml-auto text-sm text-azul-acento hover:text-white"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-azul-secundario bg-opacity-90 rounded-lg shadow-md p-6 text-white">
            <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Subtotal ({cart.length} artículos)</span>
                <span>{regularTotal.toFixed(2)}€</span>
              </div>
              
              {savings > 0 && (
                <div className="flex justify-between text-azul-acento">
                  <span>Descuentos por volumen</span>
                  <span>-{savings.toFixed(2)}€</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-300">Envío</span>
                <span>Gratis</span>
              </div>
              
              <div className="border-t border-azul-primario pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                {savings > 0 && (
                  <div className="text-xs mt-2 text-azul-acento">
                    ¡Has ahorrado {savings.toFixed(2)}€! Compra 3+ artículos para 10% descuento, 5+ para 20% descuento.
                  </div>
                )}
              </div>
            </div>
            
            <Link
              to="/checkout"
              className="mt-6 w-full bg-azul-acento text-white py-3 px-4 rounded-md font-medium hover:bg-white hover:text-azul-primario transition flex items-center justify-center"
            >
              Proceder al Pago
            </Link>
            
            <Link
              to="/"
              className="mt-4 w-full bg-transparent text-white border border-white py-3 px-4 rounded-md font-medium hover:bg-azul-primario transition flex items-center justify-center"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;