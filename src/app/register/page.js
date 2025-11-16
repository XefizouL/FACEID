// src/app/register/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Importamos el hook de enrutamiento
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Función de Firebase para registrar
import { auth } from '../../lib/firebase'; // Importamos nuestra configuración de auth

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Nuevo estado para manejar errores
  const [loading, setLoading] = useState(false); // Nuevo estado para indicar carga
  const router = useRouter(); // Inicializamos el enrutador

  // Convertimos la función a async para poder usar await
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Reiniciamos cualquier error previo
    setLoading(true); // Empezamos la carga

    // Validamos que la contraseña sea de al menos 6 caracteres
    if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        setLoading(false);
        return;
    }

    try {
      // Usamos la función de Firebase para crear el usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuario registrado con éxito:', userCredential.user);
      
      // Si el registro es exitoso, redirigimos al usuario a la página de login
      alert('¡Registro exitoso! Ahora serás redirigido para iniciar sesión.');
      router.push('/login');

    } catch (error) {
      // Manejamos los errores más comunes de Firebase
      console.error('Error en el registro:', error.code, error.message);
      if (error.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está en uso.');
      } else if (error.code === 'auth/invalid-email') {
        setError('El formato del correo electrónico no es válido.');
      } else {
        setError('Ocurrió un error al intentar registrar la cuenta.');
      }
    } finally {
      // Se ejecuta siempre, al final del try o del catch
      setLoading(false); // Terminamos la carga
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Crear una Cuenta</h1>
        
        {/* Mostramos el mensaje de error si existe */}
        {error && <p className="text-sm text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
        
        <form onSubmit={handleRegister} className="space-y-6">
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
              disabled={loading} // Deshabilitamos el botón mientras está cargando
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}