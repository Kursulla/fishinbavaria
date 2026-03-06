import allQuestionsFromTests from "./questionsFromTests.json";
import { generationQuestionsUtil } from "../../../common/data/questionsGenerationUtil";

const QUESTIONS_PER_CATEGORY = 12;//because in tests, each category has 12 questions
const TEST_CATEGORIES = ["Fischkunde", "Gewässerkunde", "Schutz und Pflege", "Fanggeräte", "Rechtsvorschriften"];

export const questionsFromTestsRepository = {
    getTotalCount: () => allQuestionsFromTests.length,
    getQuestionsCategories: () => TEST_CATEGORIES,
    getRandomTestSet: () =>
        TEST_CATEGORIES.map((category) =>
            generationQuestionsUtil.setOfQuestionsForCategory(category, QUESTIONS_PER_CATEGORY, allQuestionsFromTests)
        ),
};
