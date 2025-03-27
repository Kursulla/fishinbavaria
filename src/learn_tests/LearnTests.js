import React, {useEffect, useState} from "react";
import {generateQuestions} from "./questionsService";
import QuestionComponent from "../common/components/QuestionComponent";
import {v4 as uuidv4} from "uuid";


const LearnTests = () => {

    const [questions, setQuestions] = useState([]);
    const categories = ["Fischkunde", "Gewässerkunde", "Schutz und Pflege", "Fanggeräte", "Rechtsvorschriften"];
    // const [score, setScore] = useState(0);

    useEffect(() => {
        if (questions.length === 0) {
            const newQuestions = [];
            newQuestions.push(generateQuestions(categories[0], 12))
            newQuestions.push(generateQuestions(categories[1], 12))
            newQuestions.push(generateQuestions(categories[2], 12))
            newQuestions.push(generateQuestions(categories[3], 12))
            newQuestions.push(generateQuestions(categories[4], 12))

            setQuestions(newQuestions);
        }
    })

    const rightAnswer = (status) => {
        console.log(status)
    }

    return (
        <div className="App">
            <div className="p-6">
                {categories.map((category, index) => (
                    <div>
                        <hr/>
                        <h2>{category}</h2>
                        {questions && questions[index] && questions[index].map((question, index) => (
                            <div>
                                <QuestionComponent key={uuidv4()} index={index} question={question} rightAnswer={rightAnswer}/>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearnTests;