import React, {useEffect, useState} from "react";
import QuestionComponent from "../common/components/question-item/QuestionComponent";
import {v4 as uuidv4} from "uuid";
import { markedQuestionsRepository } from "./data/MarkedQuestionsRepository";

const LearnFromMarked = () => {
    const [questions, setQuestions] = useState([]);
    const [noMarkedQuestions, setNoMarkedQuestions] = useState(false);

    useEffect(() => {
        if (questions.length === 0 && !noMarkedQuestions) {
            refreshQuestions();
        }
    });

    function refreshQuestions() {
        const fetchedQuestions = markedQuestionsRepository.getMarkedQuestions();
        if (fetchedQuestions.length === 0) {
            setNoMarkedQuestions(true)
            return
        } else {
            console.log("There are marked questions: " + fetchedQuestions.length)
        }
        setQuestions(fetchedQuestions)
    }

    const rightAnswer = (status) => {
        console.log(status)
        // const newScore = score + 1;
        // setScore(newScore);

    }
    return (
        <div className="App">
            {noMarkedQuestions && <h3>Nema sačuvanih pitanja!</h3>}
            <div className="p-6">
                {questions && questions.map((question, index) => (
                    <div>
                        <QuestionComponent key={uuidv4()} orderNumber={index} question={question} rightAnswer={rightAnswer}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearnFromMarked;