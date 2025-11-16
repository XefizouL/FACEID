// src/app/forgot-password/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth'; // La función de Firebase para esto
import { auth } from '../../lib/firebase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // Para el mensaje de éxito
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('¡Revisa tu correo! Se ha enviado un enlace para restablecer tu contraseña.');
    } catch (error) {
      console.error('Error al enviar correo de recuperación:', error.code);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        setError('No se encontró un usuario con ese correo electrónico.');
      } else {
        setError('Ocurrió un error. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Recuperar Contraseña</h1>
        
        {/* Mostramos el mensaje de error o de éxito */}
        {error && <p className="text-sm text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
        {message && <p className="text-sm text-center text-green-500 bg-green-100 p-3 rounded-md">{message}</p>}
        
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Correo Electrónico Registrado
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          ¿Recordaste tu contraseña?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Volver a Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}