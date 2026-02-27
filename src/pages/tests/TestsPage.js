import React, { useEffect, useState } from "react";
import { questionsFromTestsRepository } from "./data/QuestionsFromTestsRepository";
import QuestionComponent from "../../common/components/question-item/QuestionComponent";
import { v4 as uuidv4 } from "uuid";

const TestsPage = () => {
    const [questions, setQuestions] = useState([]);
    const categories = questionsFromTestsRepository.getTestCategories();

    useEffect(() => {
        if (questions.length === 0) {
            setQuestions(questionsFromTestsRepository.getRandomTestSet());
        }
    }, [questions.length]);

    const rightAnswer = (status) => {
        console.log(status);
    };

    return (
        <div className="App">
            <h5>Ukupan broj pitanja sa testova: {questionsFromTestsRepository.getTotalCount()}</h5>
            <div className="p-6">
                {categories.map((category, index) => (
                    <div key={category}>
                        <h2>{category}</h2>
                        {questions && questions[index] && questions[index].map((question, qIndex) => (
                            <div key={question.number ?? qIndex}>
                                <QuestionComponent key={uuidv4()} orderNumber={qIndex} question={question} rightAnswer={rightAnswer} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestsPage;
