import allQuestions from "../common/data/pitanja.json";
import {generationQuestionsUtil} from "../common/data/questionsGenerationUtil";


const generateQuestions = (category, numberOfQuestions) => {
    return generationQuestionsUtil.setOfQuestionsForCategory(category, numberOfQuestions, allQuestions)
}

export const questionsService = {
    generateQuestions
}