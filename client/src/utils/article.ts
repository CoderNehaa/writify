export const stripHtml = (html: string, maxLength = 160): string => {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

// "06 Sep, 2026" — used everywhere an article's posted date is shown, so
// the format stays consistent across the app.
export const formatArticleDate = (date: string | Date): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  return `${day} ${month}, ${d.getFullYear()}`;
};
