// src/app/dashboard/profile/page.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import * as faceapi from 'face-api.js';
import { db } from '../../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const videoRef = useRef(null);
  
  const [loadingModels, setLoadingModels] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [message, setMessage] = useState('Apunta tu cara al centro del recuadro.');
  const [error, setError] = useState('');

  // Cargar los modelos de face-api.js
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setLoadingModels(false);
      console.log("Modelos de IA cargados");
    };
    loadModels();
  }, []);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (err) {
      setError('Error al acceder a la cámara. Revisa los permisos.');
      console.error(err);
    }
  };

  const handleRegisterFace = async () => {
    if (!videoRef.current || loadingModels) return;

    setMessage('Procesando... No te muevas.');
    
    const detections = await faceapi.detectSingleFace(
      videoRef.current, 
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks().withFaceDescriptor();
    
    if (!detections) {
      setMessage('No se detectó un rostro. Inténtalo de nuevo.');
      return;
    }

    // El 'descriptor' es la firma facial, un array de 128 números.
    const faceDescriptor = detections.descriptor;
    
    try {
      // Guardamos el descriptor en Firestore
      // Creamos un documento en la colección 'users' con el ID del usuario de auth
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { 
        email: user.email, 
        faceDescriptor: Array.from(faceDescriptor) // Lo convertimos a un array normal para guardarlo
      });
      
      setMessage('¡Rostro registrado con éxito! Ahora puedes usar el Login Facial.');
      stopCamera();

    } catch (err) {
      setError('Hubo un error al guardar tu perfil facial.');
      console.error(err);
    }
  };
  
  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOn(false);
  };

  if (!user) return <div className="flex items-center justify-center min-h-screen">Redirigiendo...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold">Perfil de Usuario</h1>
        <p>Hola, {user.email}</p>
        
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Login con Face ID</h2>
          <div className="bg-gray-800 w-full aspect-square rounded-md mx-auto overflow-hidden flex items-center justify-center">
            <video ref={videoRef} autoPlay muted className={isCameraOn ? 'block' : 'hidden'}></video>
          </div>

          {loadingModels && <p>Cargando modelos de IA...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!error && <p className="text-gray-600 h-6">{message}</p>}

          <div className="mt-4 space-y-2">
            {!isCameraOn ? (
              <button onClick={startCamera} disabled={loadingModels} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300">
                Activar Cámara
              </button>
            ) : (
              <button onClick={handleRegisterFace} className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
                Escanear y Guardar mi Rostro
              </button>
            )}
          </div>
        </div>
        <button onClick={() => router.push('/dashboard')} className="mt-4 text-indigo-600">Volver al Dashboard</button>
      </div>
    </div>
  );
}