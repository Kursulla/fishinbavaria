import allQuestions from "./pitanja.json";

const NUMBER_OF_QUESTIONS_PER_CATEGORY = 20;

export const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    const question = allQuestions[randomIndex];
    return question;
};
export const getRandomQuestionFrom = (allQuestions) => {
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    return allQuestions[randomIndex];
};
export const generateSetOfQuestionsForCategory = (category, numberOfQuestions) => {
    const categoryQuestions = allQuestions.filter(question => question.category === category);
    const selectedRandomQuestions = [];
    for (let i = 0; i <= numberOfQuestions-1; i++) {
        selectedRandomQuestions.push(getRandomQuestionFrom(categoryQuestions))
    }
    return selectedRandomQuestions;
}