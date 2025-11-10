import React from 'react';

export default function FailureAlert({ message = 'Erreur', onClose }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="max-w-xl mx-auto flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md shadow-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>

      <div className="flex-1 text-sm">
        {message}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="text-red-700 hover:text-red-900 ml-2"
        >
          ✕
        </button>
      )}
    </div>
  );
}
