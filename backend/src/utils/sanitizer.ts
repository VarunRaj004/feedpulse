export function sanitizeString(str: string): string {
  return str
    .trim()
    .substring(0, 2000) // Max length
    .replace(/[<>]/g, ""); // Remove angle brackets to prevent XSS
}

export function sanitizeFeedback(data: any) {
  return {
    title: sanitizeString(data.title || ""),
    description: sanitizeString(data.description || ""),
    category: data.category || "Other",
    submitterName: sanitizeString(data.submitterName || ""),
    submitterEmail: sanitizeString(data.submitterEmail || ""),
  };
}