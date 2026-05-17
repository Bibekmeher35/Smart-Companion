/**
 * Sanitizes input text by removing specific time-related keywords and proper nouns.
 * This helps in cleaning the task description before processing it with the AI model.
 * @param {string} text - The input text to be sanitized.
 * @returns {string} - The cleaned and trimmed text.
 */
export function sanitize(text) {
  return text
    .replace(/\b(today|tomorrow|yesterday)\b/gi, "")
    .replace(/\b[A-Z][a-z]+\b/g, "")
    .trim();
}