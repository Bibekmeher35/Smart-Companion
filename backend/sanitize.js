export function sanitize(text) {
  return text
    .replace(/\b(today|tomorrow|yesterday)\b/gi, "")
    .replace(/\b[A-Z][a-z]+\b/g, "")
    .trim();
}