import { randomUUID } from 'node:crypto';
import type { Database } from 'better-sqlite3';

export type SavePromptInput = {
  id?: string;
  rawPrompt: string;
  normalizedPrompt: string;
  promptHash: string;
  projectId?: string | null;
  workspacePath?: string | null;
  filePath?: string | null;
  branchName?: string | null;
  selectedCodeHash?: string | null;
  createdAt?: string;
};

export type PromptRecord = {
  id: string;
  rawPrompt: string;
  normalizedPrompt: string;
  promptHash: string;
  projectId: string | null;
  workspacePath: string | null;
  filePath: string | null;
  branchName: string | null;
  selectedCodeHash: string | null;
  createdAt: string;
};

type PromptRow = {
  id: string;
  raw_prompt: string;
  normalized_prompt: string;
  prompt_hash: string;
  project_id: string | null;
  workspace_path: string | null;
  file_path: string | null;
  branch_name: string | null;
  selected_code_hash: string | null;
  created_at: string;
};

export class PromptRepository {
  constructor(private readonly database: Database) {}

  savePrompt(input: SavePromptInput): PromptRecord {
    const record: PromptRecord = {
      id: input.id ?? randomUUID(),
      rawPrompt: input.rawPrompt,
      normalizedPrompt: input.normalizedPrompt,
      promptHash: input.promptHash,
      projectId: input.projectId ?? null,
      workspacePath: input.workspacePath ?? null,
      filePath: input.filePath ?? null,
      branchName: input.branchName ?? null,
      selectedCodeHash: input.selectedCodeHash ?? null,
      createdAt: input.createdAt ?? new Date().toISOString(),
    };

    this.database
      .prepare(
        `
        INSERT INTO prompts (
          id,
          raw_prompt,
          normalized_prompt,
          prompt_hash,
          project_id,
          workspace_path,
          file_path,
          branch_name,
          selected_code_hash,
          created_at
        )
        VALUES (
          @id,
          @rawPrompt,
          @normalizedPrompt,
          @promptHash,
          @projectId,
          @workspacePath,
          @filePath,
          @branchName,
          @selectedCodeHash,
          @createdAt
        )
        `,
      )
      .run(record);

    return record;
  }

  findByHash(promptHash: string): PromptRecord[] {
    const rows = this.database
      .prepare(
        `
        SELECT *
        FROM prompts
        WHERE prompt_hash = ?
        ORDER BY created_at DESC
        `,
      )
      .all(promptHash) as PromptRow[];

    return rows.map(mapPromptRow);
  }

  findRecentPrompts(limit = 20): PromptRecord[] {
    const rows = this.database
      .prepare(
        `
        SELECT *
        FROM prompts
        ORDER BY created_at DESC
        LIMIT ?
        `,
      )
      .all(limit) as PromptRow[];

    return rows.map(mapPromptRow);
  }

  findSimilarCandidates(
    options: {
      projectId?: string;
      limit?: number;
    } = {},
  ): PromptRecord[] {
    const { projectId, limit = 100 } = options;

    if (projectId) {
      const rows = this.database
        .prepare(
          `
          SELECT *
          FROM prompts
          WHERE project_id = ?
          ORDER BY created_at DESC
          LIMIT ?
          `,
        )
        .all(projectId, limit) as PromptRow[];

      return rows.map(mapPromptRow);
    }

    const rows = this.database
      .prepare(
        `
        SELECT *
        FROM prompts
        ORDER BY created_at DESC
        LIMIT ?
        `,
      )
      .all(limit) as PromptRow[];

    return rows.map(mapPromptRow);
  }
}

function mapPromptRow(row: PromptRow): PromptRecord {
  return {
    id: row.id,
    rawPrompt: row.raw_prompt,
    normalizedPrompt: row.normalized_prompt,
    promptHash: row.prompt_hash,
    projectId: row.project_id,
    workspacePath: row.workspace_path,
    filePath: row.file_path,
    branchName: row.branch_name,
    selectedCodeHash: row.selected_code_hash,
    createdAt: row.created_at,
  };
}
