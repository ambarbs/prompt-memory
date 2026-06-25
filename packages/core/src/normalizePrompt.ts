export type NormalizePromptOptions = {
  lowercase?: boolean;
};

export function normalizePrompt(
  input: string,
  options: NormalizePromptOptions = {},
): string {
  const { lowercase = true } = options;

  const normalized = input
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n');

  return lowercase ? normalized.toLowerCase() : normalized;
}
