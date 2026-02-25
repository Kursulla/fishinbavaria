import questionsFromTests from "./questionsFromTests.json";
import { generationQuestionsUtil } from "../../common/data/questionsGenerationUtil";

const QUESTIONS_PER_CATEGORY = 12;
const TEST_CATEGORIES = ["Fischkunde", "Gewässerkunde", "Schutz und Pflege", "Fanggeräte", "Rechtsvorschriften"];

export const questionsFromTestsRepository = {
    getTotalCount: () => questionsFromTests.length,
    getTestCategories: () => TEST_CATEGORIES,
    getRandomTestSet: () =>
        TEST_CATEGORIES.map((category) =>
            generationQuestionsUtil.setOfQuestionsForCategory(category, QUESTIONS_PER_CATEGORY, questionsFromTests)
        ),
};
