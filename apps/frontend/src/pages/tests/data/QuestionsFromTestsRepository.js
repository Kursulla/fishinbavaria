import allQuestionsFromTests from "./questionsFromTests.json";
import { generationQuestionsUtil } from "../../../common/data/questionsGenerationUtil";

const QUESTIONS_PER_CATEGORY = 12;
const TEST_CATEGORIES = ["Fischkunde", "Gewässerkunde", "Schutz und Pflege", "Fanggeräte", "Rechtsvorschriften"];

const MIN_OCCURRENCES_BY_CATEGORY = {
    Fischkunde: 2,
    Fanggeräte: 2,
    Rechtsvorschriften: 2,
    Gewässerkunde: 3,
    "Schutz und Pflege": 3,
};

function getSourceForCategory(category) {
    const minOccurrences = MIN_OCCURRENCES_BY_CATEGORY[category] ?? 0;
    const inCategory = allQuestionsFromTests.filter((q) => q.category === category);
    const meetingMin = inCategory.filter((q) => (q.numberOfOccurrences ?? 0) >= minOccurrences);
    return meetingMin.length > 0 ? meetingMin : inCategory;
}

export const questionsFromTestsRepository = {
    getTotalCount: () => allQuestionsFromTests.length,
    getQuestionsCategories: () => TEST_CATEGORIES,
    getRandomTestSet: () =>
        TEST_CATEGORIES.map((category) =>
            generationQuestionsUtil.setOfQuestionsForCategory(category, QUESTIONS_PER_CATEGORY, getSourceForCategory(category))
        ),
    getRandomSetForCategory: (category, numberOfQuestions) =>
        generationQuestionsUtil.setOfQuestionsForCategory(category, numberOfQuestions, getSourceForCategory(category)),
};
