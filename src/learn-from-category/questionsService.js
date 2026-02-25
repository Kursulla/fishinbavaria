import allQuestions from "../common/data/allRequiredQuestion.js";
import {generationQuestionsUtil} from "../common/data/questionsGenerationUtil";


const generateQuestions = (category, numberOfQuestions) => {
    return generationQuestionsUtil.setOfQuestionsForCategory(category, numberOfQuestions, allQuestions)
}

export const questionsService = {
    generateQuestions
}