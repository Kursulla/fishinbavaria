import { QUESTION_PROTECTED_TERMS } from "./questionProtectedTerms";
import { openRouterModelDevSettingsStorage } from "../../../../devtools/open-router-models/openRouterModelDevSettingsStorage";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MAX_ATTEMPTS = 2;

function getApiKey() {
    return process.env.REACT_APP_OPENROUTER_API_KEY?.trim();
}

function getModel() {
    return (
        openRouterModelDevSettingsStorage.getActiveModelOverride() ||
        openRouterModelDevSettingsStorage.getDefaultModelId()
    );
}

function buildProtectedTerms(question) {
    const findMatchingTerms = (text) => {
        const matches = QUESTION_PROTECTED_TERMS
            .filter((term) => text?.includes(term))
            .sort((left, right) => right.length - left.length);

        const filteredMatches = [];
        matches.forEach((term) => {
            const isCoveredByLongerMatch = filteredMatches.some((existingTerm) => existingTerm.includes(term));
            if (!isCoveredByLongerMatch) {
                filteredMatches.push(term);
            }
        });

        return filteredMatches;
    };

    return {
        questionTerms: findMatchingTerms(question.question),
        optionTermsByKey: Object.fromEntries(
            Object.entries(question.options || {}).map(([key, value]) => [
                key,
                findMatchingTerms(value),
            ])
        ),
    };
}

function buildProtectedTermsList(guards) {
    return Array.from(
        new Set([
            ...guards.questionTerms,
            ...Object.values(guards.optionTermsByKey).flat(),
        ])
    ).sort((left, right) => right.length - left.length);
}

function buildMessages(question, guards, violations = []) {
    const protectedTerms = buildProtectedTermsList(guards);

    return [
        {
            role: "system",
            content: [
                "Ti si pomocnik za ucenje za bavarski ribolovacki ispit. Odgovaras mi ISKLJUCIVO na srbskom jeziku, ne na hrvatskom, bosanskom ili sta vec. Na Srbskom!",
                "Vrati ISKLJUCIVO validan JSON objekat bez markdown-a i bez dodatnog teksta.",
                "Poštuj ova pravila strogo:",
                "1. Ne prevodi zasticene termine.",
                "2. Ako nisi siguran da li je termin strucni naziv, ostavi ga na nemackom.",
                "3. Ako se zasticeni termin nalazi u originalnom pitanju ili opciji, isti taj termin mora se pojaviti nepromenjen i u prevodu odgovarajuceg polja.",
                "4. Kršenje ovih pravila je greška.",
                "Odgovor mora imati shape:",
                '{ "translation": { "question": "...", "options": [{"key":"A","text":"..."}] }, "correctAnswerReason": "...", "wrongAnswers": [{"key":"A","reason":"..."}] }',
                "translation.question treba da bude prevod pitanja na srpski.",
                "translation.options treba da sadrzi prevedene ponudjene odgovore, svaki sa svojim key i prevedenim text poljem.",
                "correctAnswerReason treba da objasni zasto je tacan odgovor tacan.",
                "wrongAnswers treba da sadrzi razlog za svaku netacnu opciju.",
                "Primer dobrog pravila: 'Bachforelle', 'Hecht', 'Rutte (Quappe, Trüsche)' i slicni termini ostaju na nemackom i ne prevode se.",
            ].join("\n"),
        },
        {
            role: "user",
            content: [
                protectedTerms.length > 0
                    ? `Zasticeni termini koji MORAJU ostati identicni originalu: ${protectedTerms.join(", ")}`
                    : "Ako prepoznas strucne nazive vrsta, biljaka, bolesti, parazita ili propisa, ostavi ih na nemackom.",
                violations.length > 0
                    ? `Prethodni odgovor je bio pogresan. Ispravi ove prekrsaje: ${violations.join(" | ")}`
                    : "",
                "",
                `Pitanje: ${question.question}`,
                `Tacan odgovor: ${question.answer}`,
                ...Object.entries(question.options || {}).map(([key, value]) => `Opcija ${key}: ${value}`),
            ].filter(Boolean).join("\n"),
        },
    ];
}

function parseJsonFromContent(content) {
    const trimmedContent = content.trim();

    try {
        return JSON.parse(trimmedContent);
    } catch (_error) {
        const firstBraceIndex = trimmedContent.indexOf("{");
        const lastBraceIndex = trimmedContent.lastIndexOf("}");

        if (firstBraceIndex === -1 || lastBraceIndex === -1 || lastBraceIndex <= firstBraceIndex) {
            throw new Error("OpenRouter returned a non-JSON response.");
        }

        return JSON.parse(trimmedContent.slice(firstBraceIndex, lastBraceIndex + 1));
    }
}

function validateProtectedTerms(question, responseData, guards) {
    const violations = [];
    const translatedQuestion = responseData?.translation?.question ?? "";
    const translatedOptions = new Map(
        (responseData?.translation?.options || []).map((option) => [option.key, option.text ?? ""])
    );

    guards.questionTerms.forEach((term) => {
        if (question.question.includes(term) && !translatedQuestion.includes(term)) {
            violations.push(`Pitanje mora zadrzati termin "${term}"`);
        }
    });

    Object.entries(guards.optionTermsByKey).forEach(([key, terms]) => {
        const translatedOption = translatedOptions.get(key) ?? "";

        terms.forEach((term) => {
            if ((question.options?.[key] || "").includes(term) && !translatedOption.includes(term)) {
                violations.push(`Opcija ${key} mora zadrzati termin "${term}"`);
            }
        });
    });

    return violations;
}

async function requestQuestionExplanation(messages) {
    const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getApiKey()}`,
        },
        body: JSON.stringify({
            model: getModel(),
            temperature: 0,
            messages,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("OpenRouter response did not contain content.");
    }

    return parseJsonFromContent(content);
}

export async function fetchQuestionExplanation(question) {
    const apiKey = getApiKey();

    if (!apiKey) {
        throw new Error("Missing REACT_APP_OPENROUTER_API_KEY.");
    }

    const guards = buildProtectedTerms(question);
    let violations = [];

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        const responseData = await requestQuestionExplanation(
            buildMessages(question, guards, violations)
        );

        violations = validateProtectedTerms(question, responseData, guards);
        if (violations.length === 0) {
            return responseData;
        }
    }

    throw new Error(`OpenRouter response violated protected-term rules: ${violations.join(", ")}`);
}
