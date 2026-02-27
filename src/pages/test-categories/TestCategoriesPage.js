import React, { useEffect, useState } from "react";
import { testCategoriesRepository } from "./data/TestCategoriesRepository";
import QuestionComponent from "../../common/components/question-item/QuestionComponent";
import AnswerStatsBar from "../../common/components/answer-stats-bar/AnswerStatsBar";
import { v4 as uuidv4 } from "uuid";

const TestCategoriesPage = () => {
    const [numberOfQuestions, setSelectedNumberOfQuestions] = useState(20);
    const [questions, setQuestions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Fischkunde");
    const [answered, setAnswered] = useState(0);
    const [wrong, setWrong] = useState(0);
    const categories = testCategoriesRepository.getCategories();

    useEffect(() => {
        if (questions.length === 0) {
            refreshQuestions(selectedCategory, numberOfQuestions);
        }
    });

    function refreshQuestions(category, count) {
        setQuestions(testCategoriesRepository.getRandomSetForCategory(category, count));
        setAnswered(0);
        setWrong(0);
    }

    const handleCategorySelection = (event) => {
        setSelectedCategory(event.target.value);
        refreshQuestions(event.target.value, numberOfQuestions);
    };

    const handleNumberOfQuestionsChange = (event) => {
        setSelectedNumberOfQuestions(Number(event.target.value));
        refreshQuestions(selectedCategory, Number(event.target.value));
    };

    const handleAnswer = (isCorrect) => {
        setAnswered((a) => a + 1);
        if (!isCorrect) setWrong((w) => w + 1);
    };

    return (
        <div className="App">
            <AnswerStatsBar answered={answered} wrong={wrong} />
            <div className="categories_container">
                <h3>Koju kategoriju želiš da vežbaš (samo pitanja sa testova):</h3>
                <select className="drop_down" value={selectedCategory} onChange={handleCategorySelection}>
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
            <div className="number_of_questions_container">
                <h3>Koliko pitanja želiš da vidiš:</h3>
                <select
                    className="drop_down"
                    value={numberOfQuestions}
                    onChange={handleNumberOfQuestionsChange}
                    autoFocus={false}
                >
                    <option key="10" value={10}>10</option>
                    <option key="20" value={20}>20</option>
                    <option key="30" value={30}>30</option>
                    <option key="40" value={40}>40</option>
                    <option key="50" value={50}>50</option>
                </select>
            </div>
            <br />
            <br />
            <div className="p-6">
                {selectedCategory && questions && questions.map((question, index) => (
                    <div key={question.number ?? index}>
                        <QuestionComponent
                            key={question.number ?? index}
                            orderNumber={index}
                            question={question}
                            onAnswer={handleAnswer}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestCategoriesPage;
