import React from 'react';

export default function SuccessAlert({ message = 'Succès', onClose }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="max-w-xl mx-auto flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md shadow-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>

      <div className="flex-1 text-sm">
        {message}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="text-green-700 hover:text-green-900 ml-2"
        >
          ✕
        </button>
      )}
    </div>
  );
}
