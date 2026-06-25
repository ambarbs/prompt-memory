import { normalizePrompt } from './normalizePrompt.js';

export type TextSimilarityOptions = {
  lowercase?: boolean;
};

export function calculateTextSimilarity(
  firstInput: string,
  secondInput: string,
  options: TextSimilarityOptions = {},
): number {
  const first = normalizePrompt(firstInput, options);
  const second = normalizePrompt(secondInput, options);

  if (first === second) {
    return 1;
  }

  if (!first || !second) {
    return 0;
  }

  const firstBigrams = createBigrams(first);
  const secondBigrams = createBigrams(second);

  if (firstBigrams.length === 0 || secondBigrams.length === 0) {
    return first === second ? 1 : 0;
  }

  const secondBigramCounts = new Map<string, number>();

  for (const bigram of secondBigrams) {
    secondBigramCounts.set(bigram, (secondBigramCounts.get(bigram) ?? 0) + 1);
  }

  let intersection = 0;

  for (const bigram of firstBigrams) {
    const count = secondBigramCounts.get(bigram) ?? 0;

    if (count > 0) {
      intersection += 1;
      secondBigramCounts.set(bigram, count - 1);
    }
  }

  return (2 * intersection) / (firstBigrams.length + secondBigrams.length);
}

function createBigrams(input: string): string[] {
  if (input.length < 2) {
    return input ? [input] : [];
  }

  const bigrams: string[] = [];

  for (let index = 0; index < input.length - 1; index += 1) {
    bigrams.push(input.slice(index, index + 2));
  }

  return bigrams;
}
