import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { docsConfig } from "./data/docsConfig";
import "./DocsPage.css";

const DocsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || null);
  const [content, setContent] = useState("");
  const [toc, setToc] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  const categories = docsConfig.getCategories();

  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam, categories]);

  useEffect(() => {
    if (!selectedCategory) {
      setContent("");
      setToc([]);
      setError(null);
      return;
    }
    const url = docsConfig.getDocUrl(selectedCategory);
    setLoading(true);
    setError(null);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Dokument nije pronađen");
        return res.text();
      })
      .then((html) => {
        setContent(html);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Nije moguće učitati dokument.");
        setContent("");
      })
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  useEffect(() => {
    if (!content || !contentRef.current) {
      setToc([]);
      return;
    }
    const headings = contentRef.current.querySelectorAll("h1, h2, h3");
    const items = [...headings].map((el) => ({
      level: parseInt(el.tagName[1], 10),
      text: el.textContent.trim(),
      slug: el.id || "",
    }));
    setToc(items);
  }, [content]);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setSearchParams({ category });
  };

  return (
    <div className="docs-page">
      <div className="docs-page-sidebar">
        <h2 className="docs-page-title">Materijal za učenje po kategorijama</h2>
        <p className="docs-page-intro">Izaberi kategoriju da otvoriš dokument:</p>
        <ul className="docs-category-list">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                type="button"
                className={`docs-category-btn ${selectedCategory === cat ? "docs-category-btn--active" : ""}`}
                onClick={() => handleSelectCategory(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="docs-page-content">
        {loading && <p className="docs-loading">Učitavanje…</p>}
        {error && <p className="docs-error">{error}</p>}
        {!loading && !error && content && (
          <article className="docs-article">
            {toc.length > 0 && (
              <nav className="docs-toc" aria-label="Sadržaj dokumenta">
                <h3 className="docs-toc-title">Sadržaj</h3>
                <ul className="docs-toc-list">
                  {toc.map(({ level, text, slug }) => (
                    <li key={slug || text} className={`docs-toc-item docs-toc-item--h${level}`}>
                      <a href={`#${slug}`} className="docs-toc-link">
                        {text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <div
              ref={contentRef}
              className="docs-html-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        )}
        {!loading && !error && selectedCategory && !content && (
          <p className="docs-empty">Nema sadržaja za ovu kategoriju.</p>
        )}
        {!selectedCategory && (
          <p className="docs-hint">Izaberi kategoriju u meniju levo.</p>
        )}
      </div>
    </div>
  );
};

export default DocsPage;
