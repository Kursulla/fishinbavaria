import topQuestions from "./data_generation/topQuestionsFull.json";
import {generateSetOfQuestionsForCategory} from "../common/util/questionsGenerationTool";


export const generateQuestions = (category, numberOfQuestions) => {
    return generateSetOfQuestionsForCategory(category, numberOfQuestions, topQuestions)
}
