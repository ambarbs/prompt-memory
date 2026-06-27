import { execFileSync } from 'node:child_process';
import { basename } from 'node:path';

export type GitContext = {
  projectId?: string;
  workspacePath?: string;
  branchName?: string;
  remoteUrl?: string;
};

export function getGitContext(cwd = process.cwd()): GitContext {
  const workspacePath = runGit(['rev-parse', '--show-toplevel'], cwd);
  const branchName = runGit(['rev-parse', '--abbrev-ref', 'HEAD'], cwd);
  const remoteUrl = runGit(['remote', 'get-url', 'origin'], cwd);

  return {
    projectId: workspacePath ? basename(workspacePath) : undefined,
    workspacePath,
    branchName: branchName === 'HEAD' ? undefined : branchName,
    remoteUrl,
  };
}

function runGit(args: string[], cwd: string): string | undefined {
  try {
    const output = execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    const trimmed = output.trim();

    return trimmed.length > 0 ? trimmed : undefined;
  } catch {
    return undefined;
  }
}
