// src/components/AddProductForm.js
'use client';

import { useState, useRef, useEffect } from 'react';

export default function AddProductForm() {
  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null); // Guardará la foto capturada
  const [stream, setStream] = useState(null); // Guardará el stream de la cámara
  const [error, setError] = useState('');

  // Referencias a los elementos del DOM
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Función para iniciar la cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      setError("No se pudo acceder a la cámara. Revisa los permisos.");
    }
  };

  // Función para detener la cámara
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Función para capturar la foto
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
      
      // Convertir el canvas a un archivo Blob
      canvasRef.current.toBlob(blob => {
        setImage(blob);
      }, 'image/jpeg');

      stopCamera(); // Detenemos la cámara después de tomar la foto
    }
  };

  const handleRetake = () => {
    setImage(null);
    startCamera();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Por favor, captura una imagen para el producto.");
      return;
    }
    setError('');
    console.log({ name, price, stock, image });
    // Aquí irá la lógica para subir a Firebase
    alert("Producto listo para ser guardado (lógica pendiente)");
  };

  // Limpia la cámara si el componente se desmonta
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stream]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Registrar Nuevo Producto</h2>
      
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}

      {/* Sección de la Cámara */}
      <div className="mb-4 p-4 border rounded-md">
        <h3 className="font-semibold mb-2">Imagen del Producto</h3>
        <div className="bg-gray-200 w-full aspect-video rounded-md flex items-center justify-center overflow-hidden">
          {image ? (
            <img src={URL.createObjectURL(image)} alt="Producto Capturado" className="w-full h-full object-cover" />
          ) : (
            <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${!stream && 'hidden'}`}></video>
          )}
          {!stream && !image && <p className="text-gray-500">La cámara está apagada</p>}
        </div>
        <canvas ref={canvasRef} className="hidden"></canvas> {/* Canvas oculto para procesar la imagen */}
        <div className="flex justify-center gap-4 mt-4">
          {!stream && !image && (
            <button type="button" onClick={startCamera} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Iniciar Cámara
            </button>
          )}
          {stream && (
            <button type="button" onClick={captureImage} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
              Capturar Foto
            </button>
          )}
          {image && (
            <button type="button" onClick={handleRetake} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
              Tomar Otra Foto
            </button>
          )}
        </div>
      </div>

      {/* Formulario de Datos */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
          <input type="text" id="productName" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">Precio</label>
          <input type="number" id="productPrice" value={price} onChange={e => setPrice(e.target.value)} required min="0.01" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">Cantidad en Stock</label>
          <input type="number" id="productStock" value={stock} onChange={e => setStock(e.target.value)} required min="0" step="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300" disabled={!image}>
          Guardar Producto
        </button>
      </form>
    </div>
  );
}