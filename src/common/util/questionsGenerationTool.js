

export const generateSetOfQuestionsForCategory = (category, numberOfQuestions, source) => {
    const selectedQuestions = new Set();

    const categoryQuestions = source.filter(question => question.category === category);
    const selectedRandomQuestions = [];
    for (let i = 0; i <= numberOfQuestions - 1; i++) {
        let question = getRandomQuestionFrom(categoryQuestions);
        if (isAlreadySelected(question.number, selectedQuestions)) question = getRandomQuestionFrom(categoryQuestions);

        selectedRandomQuestions.push(question)
    }
    selectedQuestions.clear()
    return selectedRandomQuestions;
}

const getRandomQuestionFrom = (allQuestions) => {
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    return allQuestions[randomIndex];
};

const isAlreadySelected = (questionNumber, setToLookInto) => {
    if (setToLookInto.has(questionNumber)) return true;
    setToLookInto.add(questionNumber)
}
