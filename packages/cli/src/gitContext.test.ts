import { describe, expect, it } from 'vitest';
import { getGitContext } from './gitContext.js';

describe('getGitContext', () => {
  it('does not throw outside a git repository', () => {
    const context = getGitContext('/');

    expect(context).toEqual({
      projectId: undefined,
      workspacePath: undefined,
      branchName: undefined,
      remoteUrl: undefined,
    });
  });

  it('returns a context object', () => {
    const context = getGitContext();

    expect(context).toHaveProperty('projectId');
    expect(context).toHaveProperty('workspacePath');
    expect(context).toHaveProperty('branchName');
    expect(context).toHaveProperty('remoteUrl');
  });
});
