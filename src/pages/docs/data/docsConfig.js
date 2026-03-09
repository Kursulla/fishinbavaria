/**
 * Lista dokumenata za stranicu Dokumenti.
 * id: identifikator za URL i izbor
 * label: tekst na dugmetu u sidebar-u
 * filename: fajl u public/docs/
 */
const DOCUMENTS = [
  { id: "fischkunde-priprema", label: "Fischkunde – Priprema za ispit", filename: "Fischkunde_Priprema_za_ispit.html" },
  { id: "fischkunde-ribe", label: "Fischkunde – Ribe iz pitanja", filename: "Fischkunde_Ribe_iz_pitanja.html" },
  { id: "gewaesserkunde", label: "Gewässerkunde", filename: "Gewässerkunde_Priprema_za_ispit.html" },
  { id: "schutz-und-pflege", label: "Schutz und Pflege", filename: "Schutz_und_Pflege_Priprema_za_ispit.html" },
  { id: "fanggeraete", label: "Fanggeräte", filename: "Fanggeräte_Priprema_za_ispit.html" },
  { id: "rechtsvorschriften", label: "Rechtsvorschriften", filename: "Rechtsvorschriften_Priprema_za_ispit.html" },
];

export const docsConfig = {
  getDocuments: () => DOCUMENTS,
  getDocUrl: (docId) => {
    const doc = DOCUMENTS.find((d) => d.id === docId);
    if (!doc) return "";
    const base = process.env.PUBLIC_URL || "";
    return `${base}/docs/${doc.filename}`;
  },
};
