import { getOctokitClient } from './client.js';
import {
  GitHubAPIError,
  NetworkError,
  AuthenticationError,
} from '../errors/index.js';
import { withRetry } from '../utils/retry.js';
import type {
  CreateRepositoryParams,
  CreateIssueParams,
  ListRepositoriesParams,
  CreateCommitParams,
  ListIssuesParams,
} from '../types.js';

function handleGitHubError(error: unknown): Error {
  if (error instanceof Error) {
    const anyError = error as { status?: number; message: string };
    if (anyError.status === 401) {
      return new AuthenticationError('Token inválido o sin permisos suficientes');
    }
    return new GitHubAPIError(anyError.message, anyError.status);
  }
  return new NetworkError('Error de red al conectar con GitHub');
}

export async function createRepository(params: CreateRepositoryParams) {
  return withRetry(async () => {
    try {
      const octokit = getOctokitClient();
      const response = await octokit.repos.createForAuthenticatedUser({
        name: params.name,
        description: params.description,
        private: params.isPrivate ?? false,
        auto_init: true,
      });
      return response.data;
    } catch (error: unknown) {
      throw handleGitHubError(error);
    }
  });
}

export async function createIssue(params: CreateIssueParams) {
  return withRetry(async () => {
    try {
      const octokit = getOctokitClient();
      const response = await octokit.issues.create({
        owner: params.owner,
        repo: params.repo,
        title: params.title,
        body: params.body,
      });
      return response.data;
    } catch (error: unknown) {
      throw handleGitHubError(error);
    }
  });
}

export async function listRepositories(params: ListRepositoriesParams) {
  return withRetry(async () => {
    try {
      const octokit = getOctokitClient();
      const response = await octokit.repos.listForAuthenticatedUser({
        per_page: params.limit ?? 30,
        sort: 'updated',
      });
      return response.data;
    } catch (error: unknown) {
      throw handleGitHubError(error);
    }
  });
}

export async function createCommit(params: CreateCommitParams) {
  return withRetry(async () => {
    try {
      const octokit = getOctokitClient();

      let sha: string | undefined;

      try {
        const existing = await octokit.repos.getContent({
          owner: params.owner,
          repo: params.repo,
          path: params.filename,
        });
        if (!Array.isArray(existing.data) && 'sha' in existing.data) {
          sha = existing.data.sha;
        }
      } catch {
        sha = undefined;
      }

      const response = await octokit.repos.createOrUpdateFileContents({
        owner: params.owner,
        repo: params.repo,
        path: params.filename,
        message: params.message,
        content: Buffer.from(params.content).toString('base64'),
        sha,
      });
      return response.data;
    } catch (error: unknown) {
      throw handleGitHubError(error);
    }
  });
}

export async function listIssues(params: ListIssuesParams) {
  return withRetry(async () => {
    try {
      const octokit = getOctokitClient();
      const response = await octokit.issues.listForRepo({
        owner: params.owner,
        repo: params.repo,
        state: 'open',
      });
      return response.data;
    } catch (error: unknown) {
      throw handleGitHubError(error);
    }
  });
}