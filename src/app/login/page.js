// src/app/login/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth'; // <-- Función para Iniciar Sesión
import { auth } from '../../lib/firebase'; // <-- Misma importación de auth

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Usamos la función de Firebase para iniciar sesión
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuario autenticado con éxito:', userCredential.user);
      
      // Si el login es exitoso, redirigimos a una página de bienvenida o "dashboard"
      // Crearemos esta página en el siguiente paso.
      alert('¡Inicio de sesión exitoso!');
      router.push('/dashboard'); 

    } catch (error) {
      // Manejamos los errores más comunes de login
      console.error('Error en el inicio de sesión:', error.code, error.message);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setError('El correo o la contraseña son incorrectos.');
      } else {
        setError('Ocurrió un error al intentar iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Iniciar Sesión</h1>
        
        {error && <p className="text-sm text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Correo Electrónico
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
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
            <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                ¿Olvidaste tu contraseña?
            </Link>
        </div>
        <p className="text-sm text-center text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}