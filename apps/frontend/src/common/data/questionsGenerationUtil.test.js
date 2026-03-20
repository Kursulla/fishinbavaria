import { generationQuestionsUtil } from "./questionsGenerationUtil";
import { questionDisplayTtlStorage } from "./questionDisplayTtlStorage";

const source = [
    { number: "1", category: "Fischkunde", question: "Q1" },
    { number: "2", category: "Fischkunde", question: "Q2" },
    { number: "3", category: "Fischkunde", question: "Q3" },
    { number: "4", category: "Fischkunde", question: "Q4" },
];

describe("generationQuestionsUtil", () => {
    beforeEach(() => {
        window.sessionStorage.clear();
    });

    test("does not repeat recently answered questions while enough fresh questions exist", () => {
        questionDisplayTtlStorage.markQuestionsAsShown(source.slice(0, 2));

        const nextSet = generationQuestionsUtil.setOfQuestionsForCategory("Fischkunde", 2, source);
        const nextNumbers = nextSet.map((question) => question.number);

        expect(nextNumbers).toHaveLength(2);
        expect(new Set(nextNumbers).size).toBe(2);
        nextNumbers.forEach((number) => {
            expect(["1", "2"]).not.toContain(number);
        });
    });

    test("falls back to previously answered questions when fresh pool is too small", () => {
        questionDisplayTtlStorage.markQuestionsAsShown(source.slice(0, 3));

        const nextSet = generationQuestionsUtil.setOfQuestionsForCategory("Fischkunde", 3, source);
        const nextNumbers = nextSet.map((question) => question.number);

        expect(nextNumbers).toHaveLength(3);
        expect(new Set(nextNumbers).size).toBe(3);
    });

    test("allows questions again after ttl expires", () => {
        const now = Date.now();
        jest.spyOn(Date, "now").mockReturnValue(now);

        questionDisplayTtlStorage.markQuestionsAsShown(source.slice(0, 2));

        Date.now.mockReturnValue(now + questionDisplayTtlStorage.ONE_HOUR_IN_MS + 1);
        expect(questionDisplayTtlStorage.getRecentlyShownQuestionNumbers().size).toBe(0);

        const nextSet = generationQuestionsUtil.setOfQuestionsForCategory("Fischkunde", 2, source);
        const nextNumbers = nextSet.map((question) => question.number);

        expect(nextNumbers).toHaveLength(2);
        expect(new Set(nextNumbers).size).toBe(2);

        Date.now.mockRestore();
    });
});
