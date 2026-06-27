import { hashPrompt, normalizePrompt } from '@prompt-memory/core';
import type { PromptRecord, PromptRepository } from '@prompt-memory/sqlite';

export type SavePromptCommandInput = {
  prompt: string;
  projectId?: string;
  workspacePath?: string;
  filePath?: string;
  branchName?: string;
  selectedCodeHash?: string;
};

export type SavePromptResult =
  | {
      status: 'saved';
      prompt: PromptRecord;
    }
  | {
      status: 'duplicate';
      prompt: PromptRecord;
    };

export function savePrompt(
  repository: PromptRepository,
  input: SavePromptCommandInput,
): SavePromptResult {
  const normalizedPrompt = normalizePrompt(input.prompt);
  const promptHash = hashPrompt(input.prompt);

  const existingMatches = repository.findByHash(promptHash);

  if (existingMatches.length > 0) {
    return {
      status: 'duplicate',
      prompt: existingMatches[0],
    };
  }

  const saved = repository.savePrompt({
    rawPrompt: input.prompt,
    normalizedPrompt,
    promptHash,
    projectId: input.projectId,
    workspacePath: input.workspacePath,
    filePath: input.filePath,
    branchName: input.branchName,
    selectedCodeHash: input.selectedCodeHash,
  });

  return {
    status: 'saved',
    prompt: saved,
  };
}
