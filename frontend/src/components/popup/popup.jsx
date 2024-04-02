import React from 'react';
import './popup.css'; // Make sure to create this CSS file for styling

const PopUp = ({ isOpen, close, text }) => {
    if (!isOpen) return null;

    return (
        <div className={`popup-overlay ${isOpen ? 'active' : ''}`}>
            <div className="popup-content">
                <button className="close-btn" onClick={close}>&times;</button>
                {/* <h2 className="popup-title">Dynamic Title Here</h2> Example title */}
                <p>{text}</p>
            </div>
        </div>
    );
};

export default PopUp;
