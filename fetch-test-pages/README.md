# Fetch Bavaria test result pages

Skripta otvara [stranicu za Übungsprüfung](https://fischerpruefung-online.bayern.de/fprApp/Uebungspruefung/AnmeldungUebungspruefung.xhtml), prijavljuje se kodom 000000, završava prijem (Prüfung beenden + potvrda), pa dopisuje HTML rezultujuće stranice u fajl `html-dump-YYYY-MM-DD_HH-mm-ss.txt` (timestamp je trenutak pokretanja skripte). Ponavlja se N puta sa nasumičnom pauzom 1–10 s između runova.

## Instalacija

Iz korena projekta (gde je `package.json`):

```bash
npm install
npx playwright install chromium
```

U `package.json` treba da postoji `playwright` u devDependencies. Ako nema: `npm install -D playwright`.

## Pokretanje

Iz korena projekta:

```bash
node fetch-test-pages/fetchTestsFromTestingWebSite.js <broj_ponavljanja>
```

Primer (5 puta):

```bash
node fetch-test-pages/fetchTestsFromTestingWebSite.js 5
```

- **Izlaz:** `fetch-test-pages/html-dump-YYYY-MM-DD_HH-mm-ss.txt` (timestamp trenutka pokretanja; append – svaki run dodaje jedan blok HTML-a sa separatorom).
- **Pauza:** između ponavljanja nasumično 1–10 sekundi.

## Sledeći korak: izvlačenje pitanja

Da bi iz dobijenog dump-a izvukao/ ažurirao listu pitanja za aplikaciju:

1. Dump koji želiš da parsiraš prebaci u ulaz za skriptu za izvlačenje: u folderu `extract-questions-from-tests/` skripta očekuje fajl **`html-dump.txt`**. Možeš kopirati generisani `fetch-test-pages/html-dump-YYYY-MM-DD_HH-mm-ss.txt` tamo i preimenovati u `html-dump.txt`, ili spojiti više dumpova u jedan `html-dump.txt`.
2. U folderu `extract-questions-from-tests/` pokreni:

   ```bash
   node parseDumpWithQuestion.js
   ```

3. Generiše se `questionsFromTests_DD-MM-YYYY_HH-MM.json`. Ako želiš da aplikacija koristi tu listu, ručno je kopiraj u `src/pages/tests/data/questionsFromTests.json`.

Detalji i ulazi/izlazi: **[extract-questions-from-tests/README.md](../extract-questions-from-tests/README.md)**.
