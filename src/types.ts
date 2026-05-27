export interface GitHubConfig {
    token: string;
}

export interface ToolResult{
    success: boolean;
    data?: unknown;
    error?: string;
}

export interface CreateRepositoryParams{
    name: string;
    description?: string;
    isPrivate?: boolean;
}

export interface CreateIssueParams {
  owner: string;
  repo: string;
  title: string;
  body?: string;
}

export interface ListRepositoriesParams{
    limit?: number;
}

export interface CreateCommitParams{
  owner: string;
  repo: string;
  message: string;
  filename: string;
  content: string;
}

export interface ListIssuesParams{
  owner: string;
  repo: string;
}