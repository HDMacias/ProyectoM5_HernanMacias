import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import 'dotenv/config';

import { logInfo, logError } from './utils/logging.js';

import { createRepositoryTool, handleCreateRepository } from './tools/create-repository.js';
import { createIssueTool, handleCreateIssue } from './tools/create-issue.js';
import { listRepositoriesTool, handleListRepositories } from './tools/list-repositories.js';
import { createCommitTool, handleCreateCommit } from './tools/create-commit.js';
import { listIssuesTool, handleListIssues } from './tools/list-issues.js';

const server = new McpServer({
  name: 'github-mcp-server',
  version: '1.0.0',
});

server.tool(
  createRepositoryTool.name,
  createRepositoryTool.description,
  {
    name: z.string(),
    description: z.string().optional(),
    isPrivate: z.boolean().optional(),
  },
  async (args) => handleCreateRepository(args)
);

server.tool(
  createIssueTool.name,
  createIssueTool.description,
  {
    owner: z.string(),
    repo: z.string(),
    title: z.string(),
    body: z.string().optional(),
  },
  async (args) => handleCreateIssue(args)
);

server.tool(
  listRepositoriesTool.name,
  listRepositoriesTool.description,
  {
    limit: z.number().optional(),
  },
  async (args) => handleListRepositories(args)
);

server.tool(
  createCommitTool.name,
  createCommitTool.description,
  {
    owner: z.string(),
    repo: z.string(),
    message: z.string(),
    filename: z.string(),
    content: z.string(),
  },
  async (args) => handleCreateCommit(args)
);

server.tool(
  listIssuesTool.name,
  listIssuesTool.description,
  {
    owner: z.string(),
    repo: z.string(),
  },
  async (args) => handleListIssues(args)
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logInfo('GitHub MCP Server iniciado y escuchando...');
}

main().catch((error) => {
  logError('Error fatal al iniciar el servidor', error);
  process.exit(1);
});