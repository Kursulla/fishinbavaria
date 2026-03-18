# Izvlačenje pitanja iz testova

Skripta izvlači pitanja iz HTML dump-a zvaničnih testova (tekst u `<strong>` tagovima) i uparuje ih sa punim podacima iz baze pitanja. Rezultat je JSON lista pitanja pogodna za „Pitanja sa testova” u aplikaciji.

## Preduslov

- Node.js
- Paket `jsdom`: u korenu projekta `npm install jsdom` (ili globalno).

## Odakle uzeti HTML dump

Ako dump još nemaš, možeš ga napraviti skriptom iz **fetch-test-pages**: ona otvara Bavarsku stranicu za uebungsprüfung, prijavi se kodom 000000, završi prijem i snima HTML u `fetch-test-pages/html-dump-YYYY-MM-DD_HH-mm-ss.txt` (timestamp trenutka pokretanja). Više runova dopisuje više blokova.

Vidi: **[fetch-test-pages/README.md](../fetch-test-pages/README.md)**.

Za ovu skriptu dump mora biti u ovom folderu pod imenom **`html-dump.txt`**. Ako si dump dobio iz fetch-test-pages, prekopiraj ga ovde i preimenuj (zameni timestamp stvarnim imenom fajla, npr. `html-dump-2026-02-24_14-30-22.txt`):

```bash
cp ../fetch-test-pages/html-dump-YYYY-MM-DD_HH-mm-ss.txt html-dump.txt
```

(Ili samo jedan deo dump-a prekopiraj u `html-dump.txt`.)

## Ulazi

- **html-dump.txt** – u ovom folderu (`extract-questions-from-tests/`). HTML stranice sa testovima; pitanja su u `<strong>` tagovima.
- **../src/common/data/allRequiredQuestion.js** – cela baza pitanja (projekat).

## Pokretanje

Iz korena projekta:

```bash
node extract-questions-from-tests/parseDumpWithQuestion.js
```

Ili iz ovog foldera:

```bash
cd extract-questions-from-tests
node parseDumpWithQuestion.js
```

## Izlaz

U folderu `extract-questions-from-tests/` kreira se fajl sa datumom i vremenom u imenu, npr.:

`questionsFromTests_DD-MM-YYYY_HH-MM.json`

## Sinhronizacija sa aplikacijom

Aplikacija učitava master fajl:

`src/pages/tests/data/questionsFromTests.json`

Kada želiš da ažuriraš pitanja u aplikaciji, ručno kopiraj željeni generisani fajl u taj master, npr. iz korena projekta:

```bash
cp extract-questions-from-tests/questionsFromTests_24-02-2025_14-30.json src/pages/tests/data/questionsFromTests.json
```
