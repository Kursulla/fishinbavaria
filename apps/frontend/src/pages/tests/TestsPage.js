import React, { useEffect, useState } from "react";
import { questionsFromTestsRepository } from "./data/QuestionsFromTestsRepository";
import QuestionComponent from "../../common/components/question-item/QuestionComponent";
import AnswerStatsBar from "../../common/components/answer-stats-bar/AnswerStatsBar";
import { questionDisplayTtlStorage } from "../../common/data/questionDisplayTtlStorage";

function createCategoryStats(categories) {
    return categories.map((category) => ({
        category,
        answered: 0,
        wrong: 0,
    }));
}

const TestsPage = () => {
    const categories = questionsFromTestsRepository.getQuestionsCategories();
    const [questions, setQuestions] = useState([]);
    const [answered, setAnswered] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [categoryStats, setCategoryStats] = useState(() => createCategoryStats(categories));

    useEffect(() => {
        if (questions.length === 0) {
            setQuestions(questionsFromTestsRepository.getRandomTestSet());
            setAnswered(0);
            setWrong(0);
            setCategoryStats(createCategoryStats(categories));
        }
    }, [categories, questions.length]);

    const handleAnswer = (question, isCorrect) => {
        questionDisplayTtlStorage.markQuestionsAsShown([question]);
        setAnswered((a) => a + 1);
        if (!isCorrect) setWrong((w) => w + 1);

        setCategoryStats((currentStats) =>
            currentStats.map((item) => {
                if (item.category !== question.category) {
                    return item;
                }

                return {
                    ...item,
                    answered: item.answered + 1,
                    wrong: isCorrect ? item.wrong : item.wrong + 1,
                };
            })
        );
    };

    return (
      <div className="App">
        <AnswerStatsBar answered={answered} wrong={wrong} categoryStats={categoryStats} />
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
