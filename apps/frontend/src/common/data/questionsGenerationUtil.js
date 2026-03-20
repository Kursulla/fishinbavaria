import { questionDisplayTtlStorage } from "./questionDisplayTtlStorage";

const getUniqueQuestionsByNumber = (questions) => {
    const uniqueQuestions = new Map();

    questions.forEach((question) => {
        if (question?.number && !uniqueQuestions.has(question.number)) {
            uniqueQuestions.set(question.number, question);
        }
    });

    return Array.from(uniqueQuestions.values());
};

const shuffleQuestions = (questions) => {
    const shuffledQuestions = [...questions];

    for (let i = shuffledQuestions.length - 1; i > 0; i -= 1) {
        const swapIndex = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[swapIndex]] = [shuffledQuestions[swapIndex], shuffledQuestions[i]];
    }

    return shuffledQuestions;
};

const generateSetOfQuestionsForCategory = (categoryName, numberOfQuestions, source) => {
    const questionsBasedOnCategory = getUniqueQuestionsByNumber(
        source.filter((question) => question.category === categoryName)
    );

    const recentlyShownNumbers = questionDisplayTtlStorage.getRecentlyShownQuestionNumbers();
    const freshQuestions = questionsBasedOnCategory.filter(
        (question) => !recentlyShownNumbers.has(question.number)
    );

    const limitedFreshQuestions = shuffleQuestions(freshQuestions).slice(0, numberOfQuestions);

    if (limitedFreshQuestions.length === numberOfQuestions) {
        return limitedFreshQuestions;
    }

    const selectedNumbers = new Set(limitedFreshQuestions.map((question) => question.number));
    const fallbackQuestions = shuffleQuestions(
        questionsBasedOnCategory.filter((question) => !selectedNumbers.has(question.number))
    ).slice(0, numberOfQuestions - limitedFreshQuestions.length);

    return [...limitedFreshQuestions, ...fallbackQuestions];
};

export const generationQuestionsUtil = {
    setOfQuestionsForCategory: generateSetOfQuestionsForCategory,
};
