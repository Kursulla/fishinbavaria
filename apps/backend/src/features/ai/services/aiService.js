const { env } = require("../../../app/config/env");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MAX_ATTEMPTS = 2;
const QUESTION_PROTECTED_TERMS = [
    "Aal",
    "Aale",
    "Aitel (Döbel)",
    "Aitel",
    "Aland",
    "Äsche",
    "Äschenregion",
    "Atlantischer Lachs",
    "Armleuchtergewächs",
    "Armleuchtergewächse",
    "AVBayFiG",
    "Bachflohkrebs",
    "Bachflohkrebse",
    "Bachforelle",
    "Bachforellen",
    "Bachmuschel",
    "Bachneunauge",
    "Bachsaibling",
    "Barbe",
    "Barbenregion",
    "Barschartige (Perciden)",
    "BayFiG",
    "Bitterling",
    "Blaufelchen",
    "Brachse",
    "Brachsenregion",
    "Dreistachliger Stichling",
    "Donaukaulbarsch",
    "Dorngrundel",
    "Döbel",
    "Edelkrebs",
    "Elritze",
    "Europakanal",
    "Felchen",
    "Fischereiaufseher",
    "Fischereierlaubnis",
    "Fischereischein",
    "Fischereigesetz",
    "Fischereigesetzes",
    "AVBayFiG",
    "BayFiG",
    "BayFiG",
    "Flussbarsch",
    "Flussperlmuschel",
    "Forellenregion",
    "Frauennerfling",
    "Gänsesäger",
    "Gemeingebrauch",
    "Giebel",
    "Gründling",
    "Große Flussmuschel",
    "Güster",
    "Handangel",
    "Hasel",
    "Hecht",
    "Huchen",
    "Jugendfischereischein",
    "Kaulbarsch",
    "Karausche",
    "Karpfen",
    "Karpfenartigen (Cypriniden)",
    "Kormoran",
    "Krebspest",
    "Kreisverwaltungsbehörde",
    "Laube (Ukelei)",
    "Lachsartigen (Salmoniden)",
    "Laichausschlag",
    "Mairenke (Seelaube)",
    "Malermuschel",
    "Maifisch",
    "Mink",
    "Moderlieschen",
    "Mühlkoppe",
    "Nase",
    "Nerfling (Aland)",
    "Nerfling",
    "Neunauge",
    "Neunaugen",
    "Perciden",
    "Perlfisch",
    "Quappe",
    "Rapfen",
    "Regenbogenforelle",
    "Regenbogenforellen",
    "Reiher",
    "Renke (Felchen)",
    "Rotauge",
    "Rotfeder",
    "Rundmäulern",
    "Rutte (Quappe, Trüsche)",
    "Rutte",
    "Salmoniden",
    "Schied (Rapfen)",
    "Schied",
    "Schlammpeitzger",
    "Schmerle (Bartgrundel)",
    "Schneider",
    "Schonmaß",
    "Schonmaße",
    "Schonzeit",
    "Schonzeiten",
    "Schrätzer",
    "Seeforelle",
    "Seelaube",
    "Seesaibling",
    "Seerüßling",
    "Setzkescher",
    "Sichling",
    "Silagesickersaft",
    "Steinbeißer (Dorngrundel)",
    "Steinbeißer",
    "Steingressling",
    "Steinkrebs",
    "Sterlet",
    "Stichling",
    "Strömer",
    "Streber",
    "Sumpfkrebs",
    "Trüsche",
    "Ukelei",
    "Waller (Wels)",
    "Waller",
    "Wels",
    "Zährte (Seerüßling)",
    "Zährte",
    "Zander",
    "Zingel",
    "Zobel",
    "Zope",
    "Zwergstichling",
    "Zwergwels",
];

function buildProtectedTerms(question) {
    const findMatchingTerms = (text) => {
        const matches = QUESTION_PROTECTED_TERMS
            .filter((term) => text?.includes(term))
            .sort((left, right) => right.length - left.length);

        const filteredMatches = [];
        matches.forEach((term) => {
            const isCovered = filteredMatches.some((existingTerm) => existingTerm.includes(term));
            if (!isCovered) {
                filteredMatches.push(term);
            }
        });

        return filteredMatches;
    };

    return {
        questionTerms: findMatchingTerms(question.question),
        optionTermsByKey: Object.fromEntries(
            Object.entries(question.options || {}).map(([key, value]) => [key, findMatchingTerms(value)])
        ),
    };
}

function buildProtectedTermsList(guards) {
    return Array.from(new Set([...guards.questionTerms, ...Object.values(guards.optionTermsByKey).flat()])).sort(
        (left, right) => right.length - left.length
    );
}

function buildMessages(question, guards, violations) {
    const protectedTerms = buildProtectedTermsList(guards);

    return [
        {
            role: "system",
            content: [
                "Ti si pomocnik za ucenje za bavarski ribolovacki ispit. Odgovaras iskljucivo na srpskom jeziku.",
                "Vrati iskljucivo validan JSON objekat bez markdown-a i bez dodatnog teksta.",
                "Ne prevodi zasticene termine.",
                '{ "translation": { "question": "...", "options": [{"key":"A","text":"..."}] }, "correctAnswerReason": "...", "wrongAnswers": [{"key":"A","reason":"..."}] }',
            ].join("\n"),
        },
        {
            role: "user",
            content: [
                protectedTerms.length > 0
                    ? `Zasticeni termini koji moraju ostati identicni originalu: ${protectedTerms.join(", ")}`
                    : "Ako prepoznas strucne nazive, ostavi ih na nemackom.",
                violations.length > 0 ? `Ispravi ove prekrsaje: ${violations.join(" | ")}` : "",
                `Pitanje: ${question.question || ""}`,
                `Tacan odgovor: ${question.answer || ""}`,
                ...Object.entries(question.options || {}).map(([key, value]) => `Opcija ${key}: ${value}`),
            ]
                .filter(Boolean)
                .join("\n"),
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
    if (!env.openRouterApiKey) {
        const error = new Error("OpenRouter API key is not configured.");
        error.statusCode = 500;
        throw error;
    }

    const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.openRouterApiKey}`,
        },
        body: JSON.stringify({
            model: env.openRouterModel,
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

async function explainQuestion(question) {
    if (!question?.question || !question?.answer || !question?.options) {
        const error = new Error("Pitanje nije validno.");
        error.statusCode = 400;
        throw error;
    }

    const guards = buildProtectedTerms(question);
    let violations = [];

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        const responseData = await requestQuestionExplanation(buildMessages(question, guards, violations));
        violations = validateProtectedTerms(question, responseData, guards);

        if (violations.length === 0) {
            return responseData;
        }
    }

    throw new Error(`OpenRouter response violated protected-term rules: ${violations.join(", ")}`);
}

module.exports = {
    explainQuestion,
};
