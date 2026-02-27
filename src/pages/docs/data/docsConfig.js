const CATEGORIES = ["Fischkunde", "Gewässerkunde", "Schutz und Pflege", "Fanggeräte", "Rechtsvorschriften"];

/**
 * Maps category name to doc filename in public/docs/.
 * Convention: CategoryName_Priprema_za_ispit.html (spaces → _).
 */
function getDocFilename(category) {
  const safe = category.replace(/\s+/g, "_");
  return `${safe}_Priprema_za_ispit.html`;
}

export const docsConfig = {
  getCategories: () => CATEGORIES,
  getDocFilename,
  getDocUrl: (category) => {
    const base = process.env.PUBLIC_URL || "";
    return `${base}/docs/${getDocFilename(category)}`;
  },
};
