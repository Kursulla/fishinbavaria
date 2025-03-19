import React, {useEffect, useState} from "react";
import "./App.css";

const QuestionComponent = ({question}) => {
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        window.scrollTo(0, window.scrollY);
    });

    const handleOptionClick = (key) => {
        if(isAnswered) return
        setSelectedOption(key);
    };
    const handleAnswerQuestionClick = () =>{
        if(isAnswered) return
        setIsAnswered(true);
    }

    return (
        <div className="question-container">
            <h2 className="question-title">{question.question}</h2>
            <ul className="question-options">
                {Object.entries(question.options).map(([key, value]) => (
                    <li
                        key={key}
                        className={`cursor_hand option-item ${(key === question.answer && isAnswered) ? "correct-answer" : ""} ${selectedOption === key ? "selected-answer" : ""}`}
                        onClick={() => handleOptionClick(key)}
                    >
                        <strong>{key}:</strong> {value}
                    </li>
                ))}
            </ul>
            <button
                className="cursor_hand"
                onClick={handleAnswerQuestionClick}
            >
                Proveri odgovor
            </button>
        </div>
    );
};

export default QuestionComponent;