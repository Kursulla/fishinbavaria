import React, { useEffect, useState } from "react";
import QuestionComponent from "../../common/components/question-item/QuestionComponent";
import { v4 as uuidv4 } from "uuid";
import { markedQuestionsRepository } from "./data/MarkedQuestionsRepository";

const MarkedPage = () => {
    const [questions, setQuestions] = useState([]);
    const [noMarkedQuestions, setNoMarkedQuestions] = useState(false);

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
    }

    const rightAnswer = (status) => {
        console.log(status);
    };

    return (
        <div className="App">
            {noMarkedQuestions && <h3>Nema sačuvanih pitanja!</h3>}
            <div className="p-6">
                {questions && questions.map((question, index) => (
                    <div key={question.number ?? index}>
                        <QuestionComponent key={uuidv4()} orderNumber={index} question={question} rightAnswer={rightAnswer} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarkedPage;
