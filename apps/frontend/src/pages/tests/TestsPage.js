import React, { useEffect, useState } from "react";
import { questionsFromTestsRepository } from "./data/QuestionsFromTestsRepository";
import QuestionComponent from "../../common/components/question-item/QuestionComponent";
import AnswerStatsBar from "../../common/components/answer-stats-bar/AnswerStatsBar";
import { questionDisplayTtlStorage } from "../../common/data/questionDisplayTtlStorage";

const TestsPage = () => {
    const [questions, setQuestions] = useState([]);
    const [answered, setAnswered] = useState(0);
    const [wrong, setWrong] = useState(0);
    const categories = questionsFromTestsRepository.getQuestionsCategories();

    useEffect(() => {
        if (questions.length === 0) {
            setQuestions(questionsFromTestsRepository.getRandomTestSet());
            setAnswered(0);
            setWrong(0);
        }
    }, [questions.length]);

    const handleAnswer = (_question, isCorrect) => {
        questionDisplayTtlStorage.markQuestionsAsShown([_question]);
        setAnswered((a) => a + 1);
        if (!isCorrect) setWrong((w) => w + 1);
    };

    return (
      <div className="App">
        <AnswerStatsBar answered={answered} wrong={wrong} />
        <h5>Ukupan broj pitanja sa testova: {questionsFromTestsRepository.getTotalCount()}</h5>
        <div className="p-6">
          {categories.map((category, cIndex) => (
            <div key={category}>
              <h2>{category}</h2>
              {questions &&
                questions[cIndex] &&
                questions[cIndex].map((question, qIndex) => (
                  <div key={question.number ?? qIndex}>
                    <QuestionComponent
                      key={question.number ?? `${category}-${qIndex}`}
                      orderNumber={qIndex}
                      question={question}
                      onAnswer={handleAnswer}
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    );
};

export default TestsPage;
