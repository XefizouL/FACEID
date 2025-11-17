// src/components/VoiceCommander.js (VERSIÓN FINAL "DE UN SOLO USO")
'use client';

import { useState, useEffect, useRef } from 'react';

export default function VoiceCommander({ onCommand }) {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('Haz clic para hablar');
  // La ref ahora solo guardará la instancia activa para poder detenerla
  const activeRecognition = useRef(null); 
  // Ref para verificar si el navegador es compatible
  const isCompatible = useRef(null);

  // useEffect se ejecuta una sola vez para verificar la compatibilidad
  useEffect(() => {
    if (typeof window.SpeechRecognition === 'undefined' && typeof window.webkitSpeechRecognition === 'undefined') {
      setMessage('Navegador no compatible.');
      isCompatible.current = false;
    } else {
      isCompatible.current = true;
    }
  }, []);

  const handleMicClick = () => {
    // Si el navegador no es compatible, no hacer nada.
    if (isCompatible.current === false) return;

    // Si ya estamos escuchando, detenemos la instancia activa.
    if (isListening && activeRecognition.current) {
      activeRecognition.current.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    // Creamos una instancia completamente nueva en cada clic
    const recognition = new SpeechRecognition();
    activeRecognition.current = recognition; // La guardamos para poder detenerla si es necesario
    
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    // Asignamos los eventos a esta nueva instancia
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error("Error de reconocimiento:", event.error);
      if (event.error === 'not-allowed') {
        setMessage('Permiso de micrófono denegado.');
        alert("El permiso para el micrófono fue denegado. Debes habilitarlo en la configuración de tu navegador.");
      }
    };
    recognition.onresult = (event) => {
      onCommand(event.results[0][0].transcript.toLowerCase().trim());
    };

    // Iniciamos el reconocimiento
    try {
      recognition.start();
    } catch (e) {
      console.error("Error al iniciar reconocimiento:", e);
      // Este error no debería ocurrir con este patrón, pero lo dejamos por seguridad
    }
  };

  useEffect(() => {
    // Sincronizar el mensaje con el estado 'isListening'
    if (isListening) {
      setMessage('Escuchando...');
    } else if (isCompatible.current === true) {
      setMessage('Haz clic para hablar');
    }
  }, [isListening]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8 text-center">
      <h2 className="text-xl font-semibold mb-4">Comandos de Voz</h2>
      <p className="text-gray-600 mb-4 h-6">{message}</p>
      <button 
        onClick={handleMicClick} 
        disabled={isCompatible.current === false} // Deshabilitar si no es compatible
        className={`mx-auto flex items-center justify-center w-20 h-20 rounded-full text-white transition-colors disabled:bg-gray-400 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        aria-label="Activar comando de voz"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 006 6.93V17H7v1h6v-1h-2v-2.07z" clipRule="evenodd" />
        </svg>
      </button>
      <div className="text-sm text-gray-500 mt-4">
        <p>Ejemplos de comandos:</p>
        <p>"Genera el reporte de ventas"</p>
        <p>"Reporte de stock"</p>
      </div>
    </div>
  );
}