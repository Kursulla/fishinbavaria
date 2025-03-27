import allQuestions from "../common/data/pitanja.json";
import {generateSetOfQuestionsForCategory} from "../common/util/questionsGenerationTool";


export const generateQuestions = (category, numberOfQuestions) => {
    return generateSetOfQuestionsForCategory(category, numberOfQuestions, allQuestions)
}
