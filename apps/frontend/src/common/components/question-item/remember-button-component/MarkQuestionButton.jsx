import React, { useState } from 'react';
import './MarkQuestionButton.css';

const MarkQuestionButton = ({ alreadyMarked, question, onClick }) => {
    const [isMarked, setIsMarked] = useState(alreadyMarked);

    const handleClick = () => {
        const newState = !isMarked;
        setIsMarked(newState);
        onClick(question, newState);
    };

    return (
        <div>
            <button className={`toggle-button ${isMarked ? 'on' : 'off'}`} onClick={handleClick}>
                {isMarked ? '❤️' : '🤍'}
            </button>
        </div>
    );
};

export default MarkQuestionButton;
