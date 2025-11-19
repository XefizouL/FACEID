// src/components/AccountSelectorModal.js
'use client';

export default function AccountSelectorModal({ accounts, onSelect, onClose }) {
  // Si no hay cuentas, no se muestra nada.
  if (!accounts || accounts.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-30">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-4">Múltiples Cuentas Encontradas</h2>
        <p className="text-gray-600 mb-6">Hemos encontrado más de una cuenta asociada a tu rostro. Por favor, selecciona con cuál deseas continuar.</p>
        
        <div className="space-y-3">
          {accounts.map((email) => (
            <button
              key={email}
              onClick={() => onSelect(email)}
              className="w-full bg-indigo-600 text-white text-lg px-4 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
              {email}
            </button>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 text-sm text-gray-500 hover:text-gray-800"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}