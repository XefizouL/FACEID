// src/app/dashboard/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import Link from 'next/link'; // <-- Importa Link

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-10 bg-white rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-2">¡Bienvenido al Dashboard!</h1>
        <p className="text-gray-700 mb-6">
          Has iniciado sesión como: <span className="font-semibold">{user.email}</span>
        </p>
        {/* ===== INICIO DEL CÓDIGO A AÑADIR/MODIFICAR ===== */}
        <div className="space-y-4">
          <Link href="/dashboard/profile" className="block w-full px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Ir a mi Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="w-full px-6 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Cerrar Sesión
          </button>
        </div>
        {/* ===== FIN DEL CÓDIGO A AÑADIR/MODIFICAR ===== */}
      </div>
    </div>
  );
}