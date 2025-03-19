import React, {useState} from "react";
import "./App.css";

const QuestionComponent = ({question}) => {
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionClick = (key) => {
        setSelectedOption(key);
    };

    return (
        <div className="question-container">
            <h2 className="question-title">{question.question}</h2>
            <ul className="question-options">
                {Object.entries(question.options).map(([key, value]) => (
                    <li
                        key={key}
                        className={`option-item ${(key === question.answer && isAnswered) ? "correct-answer" : ""} ${selectedOption === key ? "selected-answer" : ""}`}
                        onClick={() => handleOptionClick(key)}
                    >
                        <strong>{key}:</strong> {value}
                    </li>
                ))}
            </ul>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded m-xl"
                onClick={() => setIsAnswered(true)}
            >
                Proveri odgovor
            </button>
        </div>
    );
};

export default QuestionComponent;