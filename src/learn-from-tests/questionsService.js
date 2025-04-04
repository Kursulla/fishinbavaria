import topQuestions from "./data_generation/topQuestionsFull.json";
import {generationQuestionsUtil} from "../common/data/questionsGenerationUtil";


const generateQuestions = (category, numberOfQuestions) => {
    return generationQuestionsUtil.setOfQuestionsForCategory(category, numberOfQuestions, topQuestions)
}

export const questionsService = {
    generateFromCategory: generateQuestions
}