import React, { useState, useContext } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    // Add item to cart with selected size
    addToCart({
      ...product,
      selectedSize,
      quantity: 1
    });
    
    // Show "Added to cart" message
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setIsAddingToCart(false);
    }, 1500);
  };
  
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };
  
  // Imagen adaptada a formato cuadrado y centrada, con fondo si no hay imagen
  const imageUrl =
    product.name && product.name.toLowerCase().includes("united")
      ? "https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dwaa990629/images/large/701237128001_pp_01_mcfc.png?sw=1600&sh=1600&sm=fit"
      : product.image;

  return (
    <Link
      to={`/producto/${product.id}`}
      className="block group"
      style={{ textDecoration: "none" }}
    >
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-xl transition">
        <div className="w-full aspect-square bg-gray-100 rounded mb-4 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="object-contain w-full h-full max-h-64 transition-transform duration-300 group-hover:scale-105"
            style={{ background: "#f3f4f6" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300x300?text=Imagen";
            }}
          />
        </div>
        <h2 className="text-xl font-bold mb-2 text-azul-acento text-center">
          {product.name
            .replace(/Home/gi, "Local")
            .replace(/Away/gi, "Visitante")
            .replace(/Third/gi, "Tercera")
            .replace(/Goalkeeper/gi, "Portero")
            .replace(/Jersey/gi, "Camiseta")
            .replace(/Shirt/gi, "Camiseta")
            .replace(/Kit/gi, "Conjunto")
            .replace(/25\/26/g, "25/26")}
        </h2>
        {product.description && (
          <p className="text-gray-400 text-sm mb-2 text-center">
            {product.description
              .replace(/Home/gi, "Local")
              .replace(/Away/gi, "Visitante")
              .replace(/Third/gi, "Tercera")
              .replace(/Goalkeeper/gi, "Portero")
              .replace(/Jersey/gi, "Camiseta")
              .replace(/Shirt/gi, "Camiseta")
              .replace(/Kit/gi, "Conjunto")}
          </p>
        )}
        <span className="font-bold text-azul-acento text-lg">
          {(product.price || 19.9).toFixed(2).replace(".", ",")}€
        </span>
        
        <div className="mb-4">
          <label htmlFor="size" className="block text-gray-700 mb-1">
            Talla
          </label>
          <select
            id="size"
            name="size"
            value={selectedSize}
            onChange={handleSizeChange}
            className="block w-full py-2 px-3 text-sm rounded border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
            <option value="3XL">3XL (+2€)</option>
          </select>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className={`w-full py-2 px-4 rounded font-medium text-white transition ${
            isAddingToCart 
              ? 'bg-green-500' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {showMessage ? 'Added to Cart!' : 'Añadir al carrito'}
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;