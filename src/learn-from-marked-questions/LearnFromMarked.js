import React, {useEffect, useState} from "react";

import QuestionComponent from "../common/components/question-component/QuestionComponent";
import {v4 as uuidv4} from "uuid";
import {questionsService} from "./questionsService";


const LearnFromMarked = () => {
    const [numberOfQuestions, setSelectedNumberOfQuestions] = useState(20);
    const [questions, setQuestions] = useState([]);
    const [noMarkedQuestions, setNoMarkedQuestions] = useState(false)

    useEffect(() => {
        if (questions.length === 0 && !noMarkedQuestions) {
            refreshQuestions(numberOfQuestions);
        }
    })

    function refreshQuestions(numberOfQuestions) {
        console.log(questionsService.fetch(numberOfQuestions))
        const tmp = questionsService.fetch(numberOfQuestions);
        const fetchedQuestions = Array.from(tmp);
        console.log(fetchedQuestions)
        if (fetchedQuestions.length === 0) {
            console.log("No questions")
            setNoMarkedQuestions(true)
            return
        } else {
            console.log("There are marked questions: " + fetchedQuestions.length)
        }
        setQuestions(fetchedQuestions)
    }

    const handleNumberOfQuestionsChange = (event) => {
        setSelectedNumberOfQuestions(Number(event.target.value));
        refreshQuestions(Number(event.target.value));
    };

    const rightAnswer = (status) => {
        console.log(status)
        // const newScore = score + 1;
        // setScore(newScore);

    }
    return (
        <div className="App">
            <div className="number_of_questions_container">
                <h3>Koliko pitanja zelis da vidis:</h3>
                <select className="drop_down" value={numberOfQuestions} onChange={handleNumberOfQuestionsChange}
                        autoFocus={false}>
                    <option key="10" value="10">10</option>
                    <option key="20" value="20">20</option>
                    <option key="30" value="30">30</option>
                    <option key="40" value="40">40</option>
                    <option key="50" value="50">50</option>
                </select>
            </div>
            {/*{score}*/}
            <br/>
            <br/>
            <div className="p-6">
                {questions && questions.map((question, index) => (
                    <div>
                        <QuestionComponent key={uuidv4()} index={index} question={question} rightAnswer={rightAnswer}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearnFromMarked;