import allQuestions from "../../common/data/allRequiredQuestion.js";
import { generationQuestionsUtil } from "../../common/data/questionsGenerationUtil";

const CATEGORIES = ["Fischkunde", "Gewässerkunde", "Schutz und Pflege", "Fanggeräte", "Rechtsvorschriften"];

export const categoryQuestionsRepository = {
    getCategories: () => CATEGORIES,
    getRandomSetForCategory: (category, numberOfQuestions) =>
        generationQuestionsUtil.setOfQuestionsForCategory(category, numberOfQuestions, allQuestions),
};
