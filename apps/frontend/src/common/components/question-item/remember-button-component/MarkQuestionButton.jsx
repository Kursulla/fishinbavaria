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
            <button className={`toggle-button mark-question-button ${isMarked ? 'on' : 'off'}`} onClick={handleClick}>
                <svg
                    className="mark-question-icon"
                    viewBox="0 0 24 24"
                    fill={isMarked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                >
                    <path d="M16.5 3.75a4.5 4.5 0 0 1 3.182 7.678L12 19.11l-7.682-7.682A4.5 4.5 0 0 1 10.682 5.07L12 6.389l1.318-1.318A4.5 4.5 0 0 1 16.5 3.75Z" />
                </svg>
            </button>
        </div>
    );
};

export default MarkQuestionButton;
