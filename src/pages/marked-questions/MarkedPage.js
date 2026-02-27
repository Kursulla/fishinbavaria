import React, { useEffect, useState } from "react";
import QuestionComponent from "../../common/components/question-item/QuestionComponent";
import AnswerStatsBar from "../../common/components/answer-stats-bar/AnswerStatsBar";
import { v4 as uuidv4 } from "uuid";
import { markedQuestionsRepository } from "./data/MarkedQuestionsRepository";

const MarkedPage = () => {
    const [questions, setQuestions] = useState([]);
    const [noMarkedQuestions, setNoMarkedQuestions] = useState(false);
    const [answered, setAnswered] = useState(0);
    const [wrong, setWrong] = useState(0);

    useEffect(() => {
        if (questions.length === 0 && !noMarkedQuestions) {
            refreshQuestions();
        }
    });

    function refreshQuestions() {
        const markedQuestions = markedQuestionsRepository.getMarkedQuestions();
        if (markedQuestions.length === 0) {
            setNoMarkedQuestions(true);
            return;
        }
        setQuestions(markedQuestions);
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
            {noMarkedQuestions && <h3>Nema sačuvanih pitanja!</h3>}
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

export default MarkedPage;
