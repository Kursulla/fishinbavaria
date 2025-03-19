import allQuestions from "./pitanja.json";

const selectedQuestions = new Set();

const getRandomQuestionFrom = (allQuestions) => {
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    return allQuestions[randomIndex];
};
export const generateSetOfQuestionsForCategory = (category, numberOfQuestions) => {
    const categoryQuestions = allQuestions.filter(question => question.category === category);
    const selectedRandomQuestions = [];
    for (let i = 0; i <= numberOfQuestions - 1; i++) {
        let question = getRandomQuestionFrom(categoryQuestions);
        if (isAlreadySelected(question.number)) question = getRandomQuestionFrom(categoryQuestions);

        selectedRandomQuestions.push(question)
    }
    selectedQuestions.clear()
    return selectedRandomQuestions;
}
const isAlreadySelected = (questionNumber) => {
    if (selectedQuestions.has(questionNumber)) return true;
    selectedQuestions.add(questionNumber)
}