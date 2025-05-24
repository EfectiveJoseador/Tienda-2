import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const hiddenFormRef = useRef(null);

  // Formulario adaptado al formato de index u.html
  const [formData, setFormData] = useState({
    emailPaypal: '',
    usuario: '',
    direccion: `Nombre completo:\nDirección:\nCiudad:\nProvincia:\nPaís:\nCódigo Postal:\nTeléfono:`
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState('');

  // Calcular total del carrito (sumando 2€ por cada producto con talla 3XL)
  const total = cart.reduce((sum, item) => {
    const extra = item.selectedSize === '3XL' ? 2 : 0;
    return sum + (item.price + extra) * item.quantity;
  }, 0);

  // Construir resumen de productos para enviar por FormSubmit
  const productosResumen = cart.map(
    item => {
      const extra = item.selectedSize === '3XL' ? 2 : 0;
      const precioFinal = (item.price + extra).toFixed(2);
      // Traducción de tallas
      let tallaTexto = item.selectedSize;
      switch (tallaTexto) {
        case 'S': tallaTexto = 'S (Pequeña)'; break;
        case 'M': tallaTexto = 'M (Mediana)'; break;
        case 'L': tallaTexto = 'L (Grande)'; break;
        case 'XL': tallaTexto = 'XL (Extra Grande)'; break;
        case 'XXL': tallaTexto = 'XXL (Doble Extra Grande)'; break;
        case '3XL': tallaTexto = '3XL (Triple Extra Grande)'; break;
        default: break;
      }
      // Traducción de título y descripción si existen
      const nombre = item.name
        .replace(/Home/gi, 'Local')
        .replace(/Away/gi, 'Visitante')
        .replace(/Third/gi, 'Tercera')
        .replace(/Goalkeeper/gi, 'Portero')
        .replace(/Jersey/gi, 'Camiseta')
        .replace(/Shirt/gi, 'Camiseta')
        .replace(/Kit/gi, 'Conjunto')
        .replace(/25\/26/g, '25/26'); // Mantener año si ya está en castellano

      // Si hay descripción, traducir palabras clave
      let descripcion = item.description || '';
      descripcion = descripcion
        .replace(/Home/gi, 'Local')
        .replace(/Away/gi, 'Visitante')
        .replace(/Third/gi, 'Tercera')
        .replace(/Goalkeeper/gi, 'Portero')
        .replace(/Jersey/gi, 'Camiseta')
        .replace(/Shirt/gi, 'Camiseta')
        .replace(/Kit/gi, 'Conjunto');

      return `• ${nombre}${descripcion ? ' - ' + descripcion : ''} | Talla: ${tallaTexto} | Cantidad: ${item.quantity} | Precio: ${precioFinal}€${extra ? ' (3XL +2€)' : ''}`;
    }
  ).join('\n');

  // Manejo de cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    setError('');
  };

  // Validación básica
  const validateForm = () => {
    if (!formData.emailPaypal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailPaypal)) {
      setError('Por favor, ingresa un correo válido de PayPal.');
      return false;
    }
    if (!formData.usuario || !/^@[A-Za-z0-9_.]{1,30}$/.test(formData.usuario)) {
      setError('Por favor, ingresa un nombre de usuario válido de Instagram (debe comenzar con @ y tener entre 1 y 30 caracteres).');
      return false;
    }
    if (!formData.direccion || formData.direccion.length < 10) {
      setError('Por favor, completa la dirección.');
      return false;
    }
    return true;
  };

  // Envía el formulario oculto a FormSubmit
  const sendFormSubmit = () => {
    if (hiddenFormRef.current) {
      hiddenFormRef.current.submit();
      setOrderComplete(true);
      clearCart();
      setIsSubmitting(false);
    }
  };

  // Abrir ventana de PayPal y enviar formulario al cerrarse
  const handlePayPal = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const width = 600;
    const height = 800;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const paypalUrl = `https://www.paypal.com/paypalme/camisetazo/${total.toFixed(2)}EUR`;
    const win = window.open(
      paypalUrl,
      'PagoPayPal',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
    const timer = setInterval(() => {
      if (win.closed) {
        clearInterval(timer);
        setTimeout(() => {
          sendFormSubmit();
        }, 1000);
      }
    }, 500);
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Finalizar compra</h1>
        <p className="text-xl mb-6">Tu carrito está vacío</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-12 text-center max-w-lg">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">¡Pedido completado!</h1>
          <p className="text-gray-600 mb-6">Gracias por tu compra. Tu pedido ha sido recibido y será procesado en breve.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-azul-acento">Finalizar compra</h1>
      <form className="bg-white rounded-lg shadow-md p-6" onSubmit={handlePayPal} autoComplete="off">
        <div className="mb-4">
          <label htmlFor="emailPaypal" className="block text-gray-700 mb-1">Correo de PayPal</label>
          <input
            type="email"
            id="emailPaypal"
            name="emailPaypal"
            value={formData.emailPaypal}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-200"
            placeholder="Ej: tucorreo@example.com"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="usuario" className="block text-gray-700 mb-1">Usuario de Instagram</label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            required
            pattern="^@[A-Za-z0-9_.]{1,30}$"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-200"
            placeholder="Ej: @roberto_carlos03"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="direccion" className="block text-gray-700 mb-1">Dirección completa</label>
          <textarea
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            rows={7}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-200"
            placeholder={`Nombre completo:\nDirección:\nCiudad:\nProvincia:\nPaís:\nCódigo Postal:\nTeléfono:`}
          />
        </div>
        <div className="mb-6">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total a pagar</span>
            <span className="text-azul-acento">{total.toFixed(2)} €</span>
          </div>
        </div>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md font-medium text-white ${
            isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 transition'
          }`}
        >
          <i className="fab fa-paypal mr-2"></i>
          {isSubmitting ? 'Procesando...' : 'Pagar con PayPal'}
        </button>
        <p className="text-xs text-gray-500 mt-4 text-center">
          * Selecciona "Enviar a amigos y familiares" en PayPal.<br />
          * Añade tu @ de Instagram en el asunto del pago para agilizar la verificación.
        </p>
      </form>
      {/* Formulario oculto para enviar a FormSubmit */}
      <form
        ref={hiddenFormRef}
        action="https://formsubmit.co/ac88c19c0b46633676d4b3e8db41dea8"
        method="POST"
        style={{ display: 'none' }}
        target="_self"
      >
        <input type="hidden" name="_next" value="https://compra-exitosa.vercel.app/" />
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_subject" value="Nuevo pedido con pago confirmado" />
        <input type="hidden" name="emailPaypal" value={formData.emailPaypal} />
        <input type="hidden" name="usuario" value={formData.usuario} />
        <input type="hidden" name="direccion" value={formData.direccion} />
        <input type="hidden" name="precio_total" value={total.toFixed(2)} />
        <input type="hidden" name="productos" value={productosResumen} />
      </form>
    </div>
  );
}

export default Checkout;