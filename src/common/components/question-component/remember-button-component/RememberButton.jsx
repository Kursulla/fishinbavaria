import React, { useState } from 'react';
import './RememberButton.css';

const RememberButton = ({ alreadyMarked, question, onClick }) => {
    const [isMarked, setIsMarked] = useState(alreadyMarked);

    const handleClick = () => {
        const newState = !isMarked;
        setIsMarked(newState);
        onClick(question, newState);
    };

    return (
        <button
            className={`toggle-button ${isMarked ? 'on' : 'off'}`}
            onClick={handleClick}
        >
            {isMarked ? 'Zapamtio' : 'Zapamti'}
        </button>
    );
};

export default RememberButton;
