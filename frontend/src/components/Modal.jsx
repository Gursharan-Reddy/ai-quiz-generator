import React from 'react';
import './Modal.css';

export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="modal-close-button">
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}