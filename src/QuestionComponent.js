import React, {useEffect, useState} from "react";
import "./App.css";

const QuestionComponent = ({question}) => {
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionClick = (key) => {
        if(isAnswered) return
        setSelectedOption(key);
        setIsAnswered(true);
    };

    return (
        <div className="question-container">
            <h2 className="question-title">{question.question}</h2>
            <ul className="question-options">
                {Object.entries(question.options).map(([key, value]) => (
                    <li
                        key={key}
                        className={`cursor_hand option-item ${(key === question.answer && isAnswered) ? "correct-answer" : ""} ${(selectedOption === key) ? "selected-answer" : ""}`}
                        onClick={() => handleOptionClick(key)}
                    >
                        <span className="left">{key}</span>
                        <span className="right">{value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionComponent;