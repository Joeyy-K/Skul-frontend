import React, { useEffect } from 'react';

function Modal({ show, onClose, children }) {
    useEffect(() => {
        function handleClickOutside(event) {
        const modalContent = document.getElementById('modal-content');
        if (modalContent && !modalContent.contains(event.target)) {
            onClose();
        }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!show) {
        return null;
    }

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div id="modal-content" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative z-20">
            {children}
            </div>
        </div>
        </div>
    );
}

export default Modal;
