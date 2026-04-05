import { docsConfig } from "../../pages/docs/data/docsConfig";

const APP_NAME = "Fishin Bavaria";

const PAGE_TITLE_BY_PATH = {
  "/": "Početna",
  "/login": "Prijava",
  "/categories": "Pitanja po kategorijama",
  "/test-categories": "Pitanja sa testova",
  "/tests": "Simulacija testova",
  "/marked": "Obeležena pitanja",
  "/docs": "Materijali za učenje",
  "/admin/users": "Admin korisnici",
};

function buildTitle(pageName) {
  return `${pageName} | ${APP_NAME}`;
}

export function getPageTitle(pathname, search) {
  if (pathname === "/docs") {
    const documentId = new URLSearchParams(search).get("doc");
    const selectedDocument = docsConfig.getDocuments().find((document) => document.id === documentId);

    if (selectedDocument) {
      return buildTitle(selectedDocument.label);
    }
  }

  return buildTitle(PAGE_TITLE_BY_PATH[pathname] || "Aplikacija");
}
