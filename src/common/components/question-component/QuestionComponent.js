import React, {useEffect, useState} from "react";
import './QuestionsComponent.css';
import RememberButton from "./remember-button-component/RememberButton";
import {savedQuestionsManager} from "../../data/SavedQuestionsManager";
import {shuffleElementsInArray} from "../../util/utilFunction";

const QuestionComponent = ({orderNumber, question, rightAnswer}) => {
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [error, setError] = useState(false);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (options.length === 0) {
            setOptions(Object.fromEntries(shuffleElementsInArray(Object.entries(question.options))));
        }
    }, [options.length, question.options]);

    const handleAnswerClick = (key) => {
        if (isAnswered) return
        setSelectedOption(key);
        setIsAnswered(true);
        if (key !== question.answer) {
            setError(true)
        } else {
            rightAnswer(true)
        }
    };

    const handleMarkForLaterOnClick = (question, state) => {
        if (state) {
            savedQuestionsManager.saveQuestion(question)
        } else {
            savedQuestionsManager.deleteQuestion(question)
        }
    }

    const isQuestionMarked = (questionNumber) => {
        const markedQuestions = savedQuestionsManager.fetchQuestionsAsSet()
        for (const item of markedQuestions) {
            if (item.number === questionNumber) {
                return true
            }
        }
        return false
    }

    return (
        <div className="question-container">
            <h2 className="question-title">{orderNumber + 1}: {question.question} <br/></h2>
            <div className="remember-button">
                <RememberButton
                    alreadyMarked={isQuestionMarked(question.number)}
                    question={question}
                    onClick={handleMarkForLaterOnClick}/>
            </div>
            <ul className="question-options">
                {Object.entries(options).map(([key, value]) => (
                    <li
                        key={key}
                        className={`cursor_hand option-item ${(key === question.answer && isAnswered) ? "correct-answer" : ""} ${(selectedOption === key) ? "selected-answer" : ""}`}
                        onClick={() => handleAnswerClick(key)}
                    >
                        <span className="right">{value}</span>
                    </li>
                ))}
            </ul>
            <p className="questionCategoryTitle">{question.category} [{question.number}]</p>
            {error && <p className="mistake">Pogresno!</p>}
        </div>
    );
};

export default QuestionComponent;