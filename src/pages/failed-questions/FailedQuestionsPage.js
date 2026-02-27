import React, { useEffect, useState } from "react";
import QuestionComponent from "../../common/components/question-item/QuestionComponent";
import { v4 as uuidv4 } from "uuid";
import { failedQuestionsRepository } from "./data/FailedQuestionsRepository";

const FailedQuestionsPage = () => {
    const [questions, setQuestions] = useState([]);
    const [noQuestions, setNoQuestions] = useState(false);

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
    }

    const rightAnswer = (status) => {
        console.log(status);
    };

    return (
        <div className="App">
            {noQuestions && <h3>Nema pitanja u kojima si pogrešio!</h3>}
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

export default FailedQuestionsPage;
