import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import productsData from "./products.json";

const TALLAS = [
  { value: "S", label: "S (Pequeña)" },
  { value: "M", label: "M (Mediana)" },
  { value: "L", label: "L (Grande)" },
  { value: "XL", label: "XL (Extra Grande)" },
  { value: "XXL", label: "XXL (Doble Extra Grande)" },
  { value: "3XL", label: "3XL (Triple Extra Grande) (+2€)" },
];

function traducirNombre(nombre) {
  return nombre
    .replace(/Home/gi, "Local")
    .replace(/Away/gi, "Visitante")
    .replace(/Third/gi, "Tercera")
    .replace(/Goalkeeper/gi, "Portero")
    .replace(/Jersey/gi, "Camiseta")
    .replace(/Shirt/gi, "Camiseta")
    .replace(/Kit/gi, "Conjunto")
    .replace(/25\/26/g, "25/26");
}

function traducirDescripcion(descripcion) {
  return (descripcion || "")
    .replace(/Home/gi, "Local")
    .replace(/Away/gi, "Visitante")
    .replace(/Third/gi, "Tercera")
    .replace(/Goalkeeper/gi, "Portero")
    .replace(/Jersey/gi, "Camiseta")
    .replace(/Shirt/gi, "Camiseta")
    .replace(/Kit/gi, "Conjunto");
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  // productsData puede ser un array vacío si no hay productos
  const product = Array.isArray(productsData)
    ? productsData.find((p) => String(p.id) === String(id))
    : null;

  // Imagen especial para United
  const imageUrl =
    product && product.name && product.name.toLowerCase().includes("united")
      ? "https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dwaa990629/images/large/701237128001_pp_01_mcfc.png?sw=1600&sh=1600&sm=fit"
      : product?.image;

  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [showInfo, setShowInfo] = useState({
    detalles: true,
    envio: false,
    cambios: false,
    pago: false,
  });

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Producto no encontrado</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-azul-acento text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
        >
          Volver
        </button>
      </div>
    );
  }

  // Calcular precio final según talla
  const extra = selectedSize === "3XL" ? 2 : 0;
  const precioFinal = ((product.price || 19.9) + extra) * quantity;

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize,
      quantity,
      price: product.price,
    });
    navigate("/cart");
  };

  const toggleInfo = (key) => {
    setShowInfo((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full aspect-square bg-gray-100 rounded flex items-center justify-center overflow-hidden mb-4">
            <img
              src={imageUrl}
              alt={product.name}
              className="object-contain w-full h-full max-h-[400px]"
              style={{ background: "#f3f4f6" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400x400?text=Imagen";
              }}
            />
          </div>
          <div className="flex flex-col items-center mt-2">
            <span className="font-bold text-azul-acento text-2xl mb-2 text-center">
              {traducirNombre(product.name)}
            </span>
            <span className="font-semibold text-lg text-gray-700 mb-2">
              {(product.price || 19.9).toFixed(2).replace(".", ",")}€
              {selectedSize === "3XL" && (
                <span className="ml-2 text-xs text-azul-acento font-bold">+2€ 3XL</span>
              )}
            </span>
            <div className="flex items-center gap-2 mb-4">
              <label htmlFor="talla" className="mr-2 font-medium text-gray-700">
                Talla
              </label>
              <select
                id="talla"
                name="talla"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-azul-acento"
              >
                {TALLAS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <label className="mr-2 font-medium text-gray-700">Cantidad</label>
              <button
                className="w-8 h-8 rounded-full border border-azul-acento flex items-center justify-center hover:bg-azul-acento hover:text-white transition"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="mx-2 min-w-[2rem] text-center">{quantity}</span>
              <button
                className="w-8 h-8 rounded-full border border-azul-acento flex items-center justify-center hover:bg-azul-acento hover:text-white transition"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-azul-acento text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition text-lg"
            >
              Añadir al carrito
            </button>
            <div className="mt-4 text-center text-gray-500 text-sm">
              <span className="font-semibold">Total:</span>{" "}
              {precioFinal.toFixed(2).replace(".", ",")}€
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-azul-acento mb-2">
            {traducirNombre(product.name)}
          </h2>
          {product.description && (
            <p className="text-gray-600 mb-2">
              {traducirDescripcion(product.description)}
            </p>
          )}
          <div className="divide-y divide-gray-200 mt-4">
            <div>
              <button
                className="w-full text-left py-3 font-semibold text-azul-acento flex justify-between items-center"
                onClick={() => toggleInfo("detalles")}
              >
                Detalles del producto
                <span>{showInfo.detalles ? "▲" : "▼"}</span>
              </button>
              {showInfo.detalles && (
                <div className="text-gray-700 text-sm pb-3 pl-2">
                  <ul className="list-disc ml-5">
                    <li>Producto nuevo y de máxima calidad.</li>
                    <li>Incluye etiquetas y packaging premium.</li>
                    <li>Disponible en todas las tallas (S a 3XL).</li>
                    <li>Personalización opcional (nombre, número, parches...)</li>
                  </ul>
                </div>
              )}
            </div>
            <div>
              <button
                className="w-full text-left py-3 font-semibold text-azul-acento flex justify-between items-center"
                onClick={() => toggleInfo("envio")}
              >
                Envío y entrega
                <span>{showInfo.envio ? "▲" : "▼"}</span>
              </button>
              {showInfo.envio && (
                <div className="text-gray-700 text-sm pb-3 pl-2">
                  <ul className="list-disc ml-5">
                    <li>Envío gratuito a toda España.</li>
                    <li>Entrega en 7-14 días laborables con seguimiento.</li>
                    <li>Embalaje seguro y discreto.</li>
                  </ul>
                </div>
              )}
            </div>
            <div>
              <button
                className="w-full text-left py-3 font-semibold text-azul-acento flex justify-between items-center"
                onClick={() => toggleInfo("cambios")}
              >
                Cambios y devoluciones
                <span>{showInfo.cambios ? "▲" : "▼"}</span>
              </button>
              {showInfo.cambios && (
                <div className="text-gray-700 text-sm pb-3 pl-2">
                  <ul className="list-disc ml-5">
                    <li>Cambios gratuitos por talla o defecto de fábrica.</li>
                    <li>Devoluciones aceptadas en 14 días tras la recepción.</li>
                  </ul>
                </div>
              )}
            </div>
            <div>
              <button
                className="w-full text-left py-3 font-semibold text-azul-acento flex justify-between items-center"
                onClick={() => toggleInfo("pago")}
              >
                Métodos de pago
                <span>{showInfo.pago ? "▲" : "▼"}</span>
              </button>
              {showInfo.pago && (
                <div className="text-gray-700 text-sm pb-3 pl-2">
                  <ul className="list-disc ml-5">
                    <li>Pago seguro con PayPal (amigos y familiares).</li>
                    <li>Soporte personalizado por Instagram: <a href="https://www.instagram.com/camisetazo._/" target="_blank" rel="noopener noreferrer" className="text-azul-acento underline">@camisetazo._</a></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-8 bg-gray-200 text-azul-acento px-6 py-2 rounded hover:bg-gray-300 transition"
      >
        Volver a la tienda
      </button>
    </div>
  );
}

export default ProductDetail;
