import React, {useState} from "react";
import './QuestionsComponent.css';
import RememberButton from "./remember-button-component/RememberButton";
import {storageManager} from "../../data/SavedQuestionsManager";

const QuestionComponent = ({index, question, rightAnswer}) => {
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [error, setError] = useState(false);

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
        if(state){
            storageManager.saveQuestion(question)
        }else{
            storageManager.deleteQuestion(question)
        }
    }

    const isQuestionMarked = (questionNumber)=>{
        const markedQuestions = storageManager.fetchQuestionsAsSet()
        for(const item of markedQuestions){
            if(item.number === questionNumber){
                return true
            }
        }
        return false
    }

    return (
        <div className="question-container">
            <h2 className="question-title">{index + 1}: {question.question} <br/></h2>
            <div className="remember-button">
                <RememberButton  alreadyMarked={isQuestionMarked(question.number)} question={question} onClick={handleMarkForLaterOnClick}/>
            </div>
            <ul className="question-options">
                {Object.entries(question.options).map(([key, index]) => (
                    <li
                        key={key}
                        className={`cursor_hand option-item ${(key === question.answer && isAnswered) ? "correct-answer" : ""} ${(selectedOption === key) ? "selected-answer" : ""}`}
                        onClick={() => handleAnswerClick(key)}
                    >
                        <span className="left">{key}</span>
                        <span className="right">{index}</span>
                    </li>
                ))}
            </ul>
            <p className="questionCategoryTitle">{question.category} [{question.number}]</p>
            {error && <p className="mistake">Pogresno!</p>}
        </div>
    );
};

export default QuestionComponent;