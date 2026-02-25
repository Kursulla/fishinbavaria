import React, {useEffect, useState} from "react";

import QuestionComponent from "../common/components/question-component/QuestionComponent";
import {v4 as uuidv4} from "uuid";
import {questionsService} from "./questionsService";


const LearnFromTests = () => {
    const [questions, setQuestions] = useState([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const categories = ["Fischkunde", "Gewässerkunde", "Schutz und Pflege", "Fanggeräte", "Rechtsvorschriften"];

    useEffect(() => {
        if (questions.length === 0) {
            const newQuestions = [];
            newQuestions.push(questionsService.generateFromCategory(categories[0], 12))
            newQuestions.push(questionsService.generateFromCategory(categories[1], 12))
            newQuestions.push(questionsService.generateFromCategory(categories[2], 12))
            newQuestions.push(questionsService.generateFromCategory(categories[3], 12))
            newQuestions.push(questionsService.generateFromCategory(categories[4], 12))

            setQuestions(newQuestions);
        }
    }, [questions.length, categories])

    const rightAnswer = (status) => {
        console.log(status)
    }

    return (
        <div className="App">
            <img className="logo" src="logo_300.png" alt="Some alt tag" width="100"/>
            <h5>Ukupan broj pitanja sa testova: {questionsService.totalNumberOfQuestionsFromTests()}</h5>
            <div className="p-6">
                {categories.map((category, index) => (
                    <div>

                        <h2>{category}</h2>
                        {questions && questions[index] && questions[index].map((question, index) => (
                            <div>
                                <QuestionComponent key={uuidv4()} orderNumber={index} question={question} rightAnswer={rightAnswer}/>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearnFromTests;