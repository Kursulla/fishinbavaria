import React, { useEffect, useState } from "react";
import QuestionComponent from "../../common/components/question-item/QuestionComponent";
import AnswerStatsBar from "../../common/components/answer-stats-bar/AnswerStatsBar";
import { failedQuestionsRepository } from "./data/FailedQuestionsRepository";

const FailedQuestionsPage = () => {
    const [questions, setQuestions] = useState([]);
    const [noQuestions, setNoQuestions] = useState(false);
    const [answered, setAnswered] = useState(0);
    const [wrong, setWrong] = useState(0);

    useEffect(() => {
        if (questions.length === 0 && !noQuestions) {
            refreshQuestions();
        }
    });

    function refreshQuestions() {
        const fetched = failedQuestionsRepository.getFailedQuestions();
        if (fetched.length === 0) {
            setNoQuestions(true);
            return;
        }
        setQuestions(fetched);
        setAnswered(0);
        setWrong(0);
    }

    const handleAnswer = (isCorrect) => {
        setAnswered((a) => a + 1);
        if (!isCorrect) setWrong((w) => w + 1);
    };

    return (
        <div className="App">
            <AnswerStatsBar answered={answered} wrong={wrong} />
            {noQuestions && <h3>Nema pitanja u kojima si pogrešio!</h3>}
            <div className="p-6">
                {questions && questions.map((question, index) => (
                    <div key={question.number ?? index}>
                        <QuestionComponent key={question.number ?? index} orderNumber={index} question={question} onAnswer={handleAnswer} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FailedQuestionsPage;
