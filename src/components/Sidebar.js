// src/components/Sidebar.js (VERSIÓN MEJORADA CON PERFIL Y LOGOUT)
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation'; // Importar useRouter
import { signOut } from 'firebase/auth'; // Importar signOut
import { auth } from '../lib/firebase'; // Importar auth

const links = [
  { name: 'Inventario', href: '/dashboard' },
  { name: 'Nueva Venta', href: '/dashboard/sales' },
  { name: 'Reportes', href: '/dashboard/reports' },
  // ===== INICIO DE LA MODIFICACIÓN =====
  { name: 'Mi Perfil (Face ID)', href: '/dashboard/profile' }, // <-- Añadimos el enlace
  // ===== FIN DE LA MODIFICACIÓN =====
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter(); // Inicializar el router

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-8 text-center">Menú</h2>
        <nav className="flex flex-col space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-md text-lg transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Botón para Cerrar Sesión en la parte inferior */}
      <button
        onClick={handleLogout}
        className="w-full mt-8 px-4 py-2 rounded-md text-lg text-gray-300 bg-red-800 hover:bg-red-700 hover:text-white transition-colors"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}