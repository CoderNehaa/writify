export const stripHtml = (html: string, maxLength = 160): string => {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

// Presentational only: pick one of the .cat-thumb-* gradient placeholders
// (defined in index.css) deterministically from a category name, so an article
// with no cover image still shows a stable coloured block like the mockup.
export const categoryGradientClass = (name?: string): string => {
  const key = (name || "").toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return `cat-thumb-${hash % 6}`;
};

// "06 Sep, 2026" — used everywhere an article's posted date is shown, so
// the format stays consistent across the app.
export const formatArticleDate = (date: string | Date): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  return `${day} ${month}, ${d.getFullYear()}`;
};
