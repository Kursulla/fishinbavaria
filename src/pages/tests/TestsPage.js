import React, { useEffect, useState } from "react";
import { questionsFromTestsRepository } from "./data/QuestionsFromTestsRepository";
import QuestionComponent from "../../common/components/question-item/QuestionComponent";
import AnswerStatsBar from "../../common/components/answer-stats-bar/AnswerStatsBar";

const TestsPage = () => {
    const [questions, setQuestions] = useState([]);
    const [answered, setAnswered] = useState(0);
    const [wrong, setWrong] = useState(0);
    const categories = questionsFromTestsRepository.getTestCategories();

    useEffect(() => {
        if (questions.length === 0) {
            setQuestions(questionsFromTestsRepository.getRandomTestSet());
            setAnswered(0);
            setWrong(0);
        }
    }, [questions.length]);

    const handleAnswer = (isCorrect) => {
        setAnswered((a) => a + 1);
        if (!isCorrect) setWrong((w) => w + 1);
    };

    return (
        <div className="App">
            <AnswerStatsBar answered={answered} wrong={wrong} />
            <h5>Ukupan broj pitanja sa testova: {questionsFromTestsRepository.getTotalCount()}</h5>
            <div className="p-6">
                {categories.map((category, index) => (
                    <div key={category}>
                        <h2>{category}</h2>
                        {questions && questions[index] && questions[index].map((question, qIndex) => (
                            <div key={question.number ?? qIndex}>
                                <QuestionComponent key={question.number ?? `${category}-${qIndex}`} orderNumber={qIndex} question={question} onAnswer={handleAnswer} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestsPage;
