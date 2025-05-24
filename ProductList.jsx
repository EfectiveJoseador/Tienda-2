import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      // Usa una ruta relativa al público (asegúrate de que el archivo esté en /public)
      const response = await fetch(process.env.PUBLIC_URL + '/products.json');
      if (!response.ok) throw new Error('Error 404: Archivo no encontrado');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar los productos. Verifica la consola para más detalles.');
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        {error}
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-azul-acento">Camisetas 25/26</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              name: product.name.replace(/(\d{2}\/\d{2})?$/, '25/26').replace(/25\/2625\/26/, '25/26') // asegura el año
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
