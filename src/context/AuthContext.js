// src/context/AuthContext.js
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

// 1. Creamos el Contexto
const AuthContext = createContext();

// 2. Creamos un hook personalizado para usar el contexto más fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Creamos el componente Proveedor
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para saber si ya verificó la sesión

  useEffect(() => {
    // onAuthStateChanged es un "oyente" de Firebase que se activa
    // cada vez que el estado de autenticación cambia (login/logout).
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // El usuario está autenticado
        setUser(user);
      } else {
        // El usuario no está autenticado
        setUser(null);
      }
      // Ya terminó la verificación inicial, pasamos loading a false
      setLoading(false);
    });

    // Nos desuscribimos del oyente cuando el componente se desmonta
    return () => unsubscribe();
  }, []); // El array vacío [] asegura que esto se ejecute solo una vez

  // El valor que proveeremos a toda la app
  const value = {
    user,
    loading,
  };

  // Si no ha terminado de cargar, no mostramos nada para evitar parpadeos
  // Opcionalmente, puedes mostrar un spinner de carga aquí.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}