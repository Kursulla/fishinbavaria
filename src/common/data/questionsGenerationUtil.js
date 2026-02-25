

const generateSetOfQuestionsForCategory = (category, numberOfQuestions, source) => {
    const getRandomQuestionFrom = (questions) => {
        return questions[Math.floor(Math.random() * questions.length)];
    };

    const selectedQuestions = new Set();

    const questionsBasedOnCategory = source.filter(question => question.category === category);
    const randomlySelectedQuestions = [];
    for (let i = 0; i <= numberOfQuestions - 1; i++) {
        let question = getRandomQuestionFrom(questionsBasedOnCategory);
        if (isAlreadySelected(question.number, selectedQuestions)) question = getRandomQuestionFrom(questionsBasedOnCategory);

        randomlySelectedQuestions.push(question)
    }
    selectedQuestions.clear()
    return randomlySelectedQuestions;
}



const isAlreadySelected = (questionNumber, setToLookInto) => {
    if (setToLookInto.has(questionNumber)) return true;
    setToLookInto.add(questionNumber)
}

export const generationQuestionsUtil= {
    setOfQuestionsForCategory: generateSetOfQuestionsForCategory
}
