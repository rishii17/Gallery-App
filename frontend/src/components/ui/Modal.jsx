import React from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * A reusable modal component that displays content in a centered overlay.
 *
 * @param {object} props - The component's props.
 * @param {boolean} props.isOpen - Controls whether the modal is visible.
 * @param {Function} props.onClose - Function to call when the modal should be closed.
 * @param {string} props.title - The title to display in the modal's header.
 * @param {React.ReactNode} props.children - The content to be displayed inside the modal.
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  // If the modal is not open, render nothing.
  if (!isOpen) {
    return null;
  }

  return (
    // Main overlay: fixed position, covers the entire screen, and has a semi-transparent background.
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose} // Allows closing the modal by clicking the background
    >
      {/* Modal content container: stops click propagation to prevent closing when clicking inside the modal. */}
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevents the overlay's onClick from firing
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;