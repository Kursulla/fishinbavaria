# Izvlačenje pitanja iz testova

Skripta izvlači pitanja iz HTML dump-a zvaničnih testova i uparuje ih sa punim podacima iz baze pitanja.

## Pokretanje

Iz ovog foldera:

```bash
node parseDumpWithQuestion.js
```

Potrebno: Node.js, paket `jsdom` (`npm install jsdom` u root-u projekta ili globalno).

## Ulazi

- **html-dump.txt** – HTML sadržaj stranice sa testovima (tekst pitanja u `<strong>` tagovima).
- **../src/common/data/allRequiredQuestion.js** – cela baza pitanja (projekat).

## Izlaz

U ovom folderu se kreira fajl sa datumom i vremenom u imenu, npr.:

`questionsFromTests_DD-MM-YYYY_HH-MM.json`

## Sinhronizacija sa aplikacijom

Aplikacija učitava master fajl:

`src/learn-from-tests/questionsFromTests.json`

Kada želiš da ažuriraš pitanja u aplikaciji, ručno kopiraj željeni generisani fajl (npr. `questionsFromTests_24-02-2025_14-30.json`) u taj master fajl, npr.:

```bash
cp questionsFromTests_24-02-2025_14-30.json ../src/learn-from-tests/questionsFromTests.json
```
