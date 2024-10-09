import React from 'react';
import './riskUserDetail.css';

const Modal = ({ isOpen, onClose, imageSrc }) => {
    if (!isOpen) return null;

    return (
        <div className="screenshot" onClick={onClose}>
            <div className="screenshot-content" onClick={e => e.stopPropagation()}>
                <span className="close-btn" onClick={onClose}>&times;</span>
                <img src={imageSrc} alt="Screenshot" />
            </div>
        </div>
    );
};
export default Modal;
