export const schema = `
CREATE TABLE IF NOT EXISTS prompts (
  id TEXT PRIMARY KEY,
  raw_prompt TEXT NOT NULL,
  normalized_prompt TEXT NOT NULL,
  prompt_hash TEXT NOT NULL,
  project_id TEXT,
  workspace_path TEXT,
  file_path TEXT,
  branch_name TEXT,
  selected_code_hash TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prompts_prompt_hash
ON prompts (prompt_hash);

CREATE INDEX IF NOT EXISTS idx_prompts_project_id
ON prompts (project_id);

CREATE INDEX IF NOT EXISTS idx_prompts_created_at
ON prompts (created_at);
`;
