// src/app/page.js
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sistema de Gestión de Ventas
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Bienvenido a tu parcial final. Por favor, inicia sesión o crea una cuenta.
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 font-semibold text-gray-900 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </main>
  );
}