const { env } = require("../../../app/config/env");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const FISH_TRANSLATIONS = [
  { de: "Aal", sr: "Jegulja", lat: "Anguilla anguilla", terms: ["Aal", "Aale"] },
  { de: "Aitel (Döbel)", sr: "Klen", lat: "Squalius cephalus", terms: ["Aitel (Döbel)", "Aitel", "Döbel"] },
  { de: "Aland", sr: "Ide (bolen)", lat: "Leuciscus idus", terms: ["Aland", "Nerfling", "Nerfling (Aland)"] },
  { de: "Äsche", sr: "Lipljen", lat: "Thymallus thymallus", terms: ["Äsche", "Äschen"] },
  { de: "Atlantischer Lachs", sr: "Atlantski losos", lat: "Salmo salar", terms: ["Atlantischer Lachs", "Atlantische Lachse"] },
  { de: "Bachforelle", sr: "Potočna pastrmka", lat: "Salmo trutta", terms: ["Bachforelle", "Bachforellen"] },
  { de: "Bachneunauge", sr: "Potočna lampetra", lat: "Lampetra planeri", terms: ["Bachneunauge", "Bachneunaugen", "Neunauge", "Neunaugen"] },
  { de: "Bachsaibling", sr: "Potočni golac", lat: "Salvelinus fontinalis", terms: ["Bachsaibling", "Bachsaiblinge"] },
  { de: "Barbe", sr: "Mrena", lat: "Barbus barbus", terms: ["Barbe", "Barben"] },
  { de: "Bitterling", sr: "Gavčica", lat: "Rhodeus amarus", terms: ["Bitterling", "Bitterlinge"] },
  { de: "Brachse", sr: "Deverika", lat: "Abramis brama", terms: ["Brachse", "Brachsen"] },
  { de: "Flussbarsch", sr: "Grgeč", lat: "Perca fluviatilis", terms: ["Flussbarsch", "Flussbarsche"] },
  { de: "Giebel", sr: "Srebrni karaš", lat: "Carassius gibelio", terms: ["Giebel"] },
  { de: "Gründling", sr: "Krkuša", lat: "Gobio gobio", terms: ["Gründling", "Gründlinge"] },
  { de: "Güster", sr: "Bjelica", lat: "Blicca bjoerkna", terms: ["Güster"] },
  { de: "Hasel", sr: "Ječmenka", lat: "Leuciscus leuciscus", terms: ["Hasel"] },
  { de: "Hecht", sr: "Štuka", lat: "Esox lucius", terms: ["Hecht", "Hechte"] },
  { de: "Huchen", sr: "Mladica", lat: "Hucho hucho", terms: ["Huchen"] },
  { de: "Kaulbarsch", sr: "Balavac", lat: "Gymnocephalus cernua", terms: ["Kaulbarsch", "Kaulbarsch", "Kaulbarsche"] },
  { de: "Karausche", sr: "Karaš", lat: "Carassius carassius", terms: ["Karausche", "Karauschen"] },
  { de: "Karpfen", sr: "Šaran", lat: "Cyprinus carpio", terms: ["Karpfen"] },
  { de: "Laube (Ukelei)", sr: "Uklija", lat: "Alburnus alburnus", terms: ["Laube (Ukelei)", "Laube", "Lauben", "Ukelei", "Ukeleien"] },
  { de: "Mairenke (Seelaube)", sr: "Jezerska uklija", lat: "Alburnus mento", terms: ["Mairenke (Seelaube)", "Mairenke", "Mairenken", "Seelaube", "Seelauben"] },
  { de: "Maifisch", sr: "Atlantska haringa", lat: "Alosa alosa", terms: ["Maifisch", "Maifische"] },
  { de: "Moderlieschen", sr: "Bezribica", lat: "Leucaspius delineatus", terms: ["Moderlieschen"] },
  { de: "Mühlkoppe", sr: "Glavoč", lat: "Cottus gobio", terms: ["Mühlkoppe", "Mühlkoppen"] },
  { de: "Nase", sr: "Podust", lat: "Chondrostoma nasus", terms: ["Nase", "Nasen"] },
  { de: "Perlfisch", sr: "Perlfish", lat: "Rutilus meidingeri", terms: ["Perlfisch", "Perlfische"] },
  { de: "Quappe", sr: "Manić", lat: "Lota lota", terms: ["Quappe", "Quappen", "Rutte", "Rutten", "Rutte (Quappe, Trüsche)", "Trüsche"] },
  { de: "Rapfen", sr: "Bolen", lat: "Aspius aspius", terms: ["Rapfen", "Schied", "Schied (Rapfen)"] },
  { de: "Regenbogenforelle", sr: "Kalifornijska pastrmka", lat: "Oncorhynchus mykiss", terms: ["Regenbogenforelle", "Regenbogenforellen"] },
  { de: "Renke (Felchen)", sr: "Siga", lat: "Coregonus spp.", terms: ["Renke (Felchen)", "Renke", "Renken", "Felchen"] },
  { de: "Rotauge", sr: "Bodorka", lat: "Rutilus rutilus", terms: ["Rotauge", "Rotaugen"] },
  { de: "Rotfeder", sr: "Crvenperka", lat: "Scardinius erythrophthalmus", terms: ["Rotfeder", "Rotfedern"] },
  { de: "Schlammpeitzger", sr: "Barski vijun", lat: "Misgurnus fossilis", terms: ["Schlammpeitzger"] },
  { de: "Schmerle", sr: "Vijun", lat: "Barbatula barbatula", terms: ["Schmerle", "Schmerlen", "Schmerle (Bartgrundel)", "Bartgrundel"] },
  { de: "Schneider", sr: "Dvopruga uklija", lat: "Alburnoides bipunctatus", terms: ["Schneider"] },
  { de: "Seeforelle", sr: "Jezerska pastrmka", lat: "Salmo trutta", terms: ["Seeforelle", "Seeforellen"] },
  { de: "Seesaibling", sr: "Jezerska zlatovčica", lat: "Salvelinus alpinus", terms: ["Seesaibling", "Seesaiblinge"] },
  { de: "Steinbeißer", sr: "Vijunac", lat: "Cobitis taenia", terms: ["Steinbeißer", "Steinbeißer (Dorngrundel)", "Dorngrundel"] },
  { de: "Sterlet", sr: "Kečiga", lat: "Acipenser ruthenus", terms: ["Sterlet"] },
  { de: "Stichling", sr: "Trobodljikavi bodljikavac", lat: "Gasterosteus aculeatus", terms: ["Stichling", "Stichlinge"] },
  { de: "Waller (Wels)", sr: "Som", lat: "Silurus glanis", terms: ["Waller (Wels)", "Waller", "Wels", "Welse"] },
  { de: "Zander", sr: "Smuđ", lat: "Sander lucioperca", terms: ["Zander"] },
  { de: "Zingel", sr: "Zingel", lat: "Zingel zingel", terms: ["Zingel"] },
  { de: "Zope", sr: "Zlatooka", lat: "Abramis ballerus", terms: ["Zope"] },
  { de: "Zwergwels", sr: "Patuljasti somić", lat: "Ameiurus nebulosus", terms: ["Zwergwels", "Zwergwelse"] },
];

const FISH_GLOSSARY_TERMS = new Set(FISH_TRANSLATIONS.flatMap((entry) => entry.terms || [entry.de]));

const QUESTION_PROTECTED_TERMS = [
    "Äschenregion",
    "Armleuchtergewächs",
    "Armleuchtergewächse",
    "AVBayFiG",
    "Bachflohkrebs",
    "Bachflohkrebse",
    "Bachmuschel",
    "Barbenregion",
    "Barschartige (Perciden)",
    "BayFiG",
    "Blaufelchen",
    "Brachsenregion",
    "Dreistachliger Stichling",
    "Donaukaulbarsch",
    "Dorngrundel",
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
    "Flussperlmuschel",
    "Forellenregion",
    "Frauennerfling",
    "Gänsesäger",
    "Gemeingebrauch",
    "Große Flussmuschel",
    "Handangel",
    "Jugendfischereischein",
    "Karpfenartigen (Cypriniden)",
    "Kormoran",
    "Krebspest",
    "Kreisverwaltungsbehörde",
    "Lachsartigen (Salmoniden)",
    "Laichausschlag",
    "Malermuschel",
    "Mink",
    "Perciden",
    "Reiher",
    "Rundmäulern",
    "Salmoniden",
    "Schonmaß",
    "Schonmaße",
    "Schonzeit",
    "Schonzeiten",
    "Schrätzer",
    "Seerüßling",
    "Setzkescher",
    "Sichling",
    "Silagesickersaft",
    "Steingressling",
    "Steinkrebs",
    "Strömer",
    "Streber",
    "Sumpfkrebs",
    "Zährte (Seerüßling)",
    "Zährte",
    "Zobel",
    "Zwergstichling",
];

function buildProtectedTerms(question) {
    const findMatchingTerms = (text) => {
        const matches = QUESTION_PROTECTED_TERMS
            .filter((term) => !FISH_GLOSSARY_TERMS.has(term) && text?.includes(term))
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

function buildFishTranslationHints(question) {
    const searchableText = [question.question || "", ...Object.values(question.options || {})].join("\n");

    return FISH_TRANSLATIONS.filter((entry) =>
        (entry.terms || [entry.de]).some((term) => searchableText.includes(term))
    ).sort((left, right) => right.de.length - left.de.length);
}

function buildMessages(question, guards) {
    const hintedTerms = buildProtectedTermsList(guards);
    const fishHints = buildFishTranslationHints(question);

    return [
        {
            role: "system",
            content: [
                "Ti si pomocnik za ucenje za bavarski ribolovacki ispit. Odgovaras iskljucivo na srpskom jeziku.",
                "Vrati iskljucivo validan JSON objekat bez markdown-a i bez dodatnog teksta.",
                "Sam prepoznaj strucne termine u pitanju i opcijama.",
                "Strucnim terminima smatraj nazive riba, drugih zivotinja i biljaka, bolesti, parazita, pravne termine, nazive propisa, vodne i hemijske termine, bioloske klasifikacije i druge strucne izraze relevantne za ribolovacki ispit.",
                "Kada prevodis nazive riba, prvo proveri da li za njih postoji eksplicitan prevod u dostavljenom fish glossary hint-u. Ako postoji, obavezno koristi bas taj srpski naziv i taj latinski naziv, a ne svoju varijantu.",
                "Samo ako riba nije pokrivena fish glossary hint-om, prvo identifikuj tacan latinski naziv vrste, a zatim na osnovu tog latinskog naziva odredi najprikladniji srpski naziv. Nemoj nagadjati srpski naziv samo iz nemackog naziva ako nisi siguran u vrstu.",
                'Za takve termine koristi format "srpski prevod (originalni nemacki termin)". Primer: "pastrmka (Forelle)".',
                "Nemoj stavljati zagrade uz obicne svakodnevne reci koje nisu strucni termini.",
                "Polje correctAnswerReason mora da bude detaljno i edukativno objasnjenje zasto je tacan odgovor zaista tacan.",
                "U correctAnswerReason ne prepricavaj samo tekst pitanja i ne oslanjaj se samo na tragove iz ponudjenih odgovora.",
                "Objasnjenje zasnuj na opstem znanju: definicijama, biologiji, ekologiji, pravu, pravilima ribolova, tehnickim principima ili drugim relevantnim cinjenicama iz sireg konteksta teme.",
                "Ako je pitanje o vrsti ribe, objasni po cemu se ta vrsta prepoznaje, koje su njene bitne osobine, kojoj grupi pripada ili po cemu se razlikuje od slicnih vrsta.",
                "Ako je pitanje o propisima ili pravilima, objasni svrhu tog pravila i siri pravni ili prakticni kontekst, a ne samo da je to 'tacan odgovor iz pitanja'.",
                "Ako je pitanje o ekologiji, anatomiji, bolestima, alatima ili metodama, objasni uzrocno-posledicne veze i osnovni princip zbog kog je odgovor tacan.",
                "Cilj je da korisnik moze nesto da nauci iz correctAnswerReason i da razume temu i van konkretnog pitanja.",
                "Kada nisi potpuno siguran u neku tvrdnju, budi oprezan, nemoj izmisljati detalje i drzi se onoga sto je siroko poznato i verovatno tacno.",
                "Wrong answer reasons mogu biti kraci, ali i oni treba da objasne zasto odgovor nije tacan, po mogucstvu kroz opsti princip.",
                '{ "translation": { "question": "...", "options": [{"key":"A","text":"..."}] }, "correctAnswerReason": "...", "wrongAnswers": [{"key":"A","reason":"..."}] }',
            ].join("\n"),
        },
        {
            role: "user",
            content: [
                hintedTerms.length > 0
                    ? `Hint: u ovom pitanju se pojavljuju sledeci termini iz nase interne liste primera. Koristi ih samo kao pomoc, lista nije potpuna niti obavezujuca: ${hintedTerms.join(", ")}`
                    : "Hint: ako prepoznas strucne termine, sam odluci koji treba da budu u formatu prevod (original).",
                fishHints.length > 0
                    ? `Fish glossary hint (autoritativan za ribe koje su ovde navedene): ${fishHints
                          .map((entry) => `${entry.de} -> ${entry.sr} [${entry.lat}] | varijante: ${(entry.terms || [entry.de]).join(", ")}`)
                          .join("; ")}`
                    : "Fish glossary hint: ako neka riba nije navedena, sam odredi latinski naziv pa srpski prevod.",
                "Za correctAnswerReason daj detaljno objasnjenje zasnovano na opstem znanju o temi, tako da korisnik moze da nauci zasto je odgovor tacan i van ovog konkretnog pitanja.",
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
    return requestQuestionExplanation(buildMessages(question, guards));
}

module.exports = {
    explainQuestion,
};
