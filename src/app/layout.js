// src/app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext'; // <-- 1. Importar

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sistema de Ventas',
  description: 'Parcial Final de Bases de Datos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider> {/* <-- 2. Envolver a los children */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}