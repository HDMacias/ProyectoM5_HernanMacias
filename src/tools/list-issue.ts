import { ListIssuesSchema } from '../schemas/index.js';
import { listIssues } from '../github/operations.js';
import { toHumanMessage } from '../errors/index.js';
import { logInfo, logError } from '../utils/logging.js';

export const listIssuesTool = {
  name: 'list_issues',
  description:
    'Lista los issues abiertos de un repositorio específico en GitHub. ' +
    'Usa este tool cuando el usuario quiera ver los issues pendientes, ' +
    'consultar bugs abiertos, o revisar las tareas de un repositorio.',
  inputSchema: {
    type: 'object',
    properties: {
      owner: {
        type: 'string',
        description: 'Usuario u organización dueña del repositorio.',
      },
      repo: {
        type: 'string',
        description: 'Nombre del repositorio del que se listarán los issues.',
      },
    },
    required: ['owner', 'repo'],
  },
};

export async function handleListIssues(args: unknown) {
  const parsed = ListIssuesSchema.safeParse(args);

  if (!parsed.success) {
    const message = parsed.error.errors.map(e => e.message).join(', ');
    return {
      content: [{ type: 'text', text: `Error de validación: ${message}` }],
      isError: true,
    };
  }

  try {
    logInfo('Listando issues', { repo: parsed.data.repo });
    const issues = await listIssues(parsed.data);

    if (issues.length === 0) {
      return {
        content: [{ type: 'text', text: `No hay issues abiertos en ${parsed.data.owner}/${parsed.data.repo}.` }],
      };
    }

    const issueList = issues
      .map(i => `- #${i.number} ${i.title} → ${i.html_url}`)
      .join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Issues abiertos en ${parsed.data.owner}/${parsed.data.repo} (${issues.length}):\n\n${issueList}`,
        },
      ],
    };
  } catch (error) {
    logError('Error al listar issues', error);
    return {
      content: [{ type: 'text', text: toHumanMessage(error) }],
      isError: true,
    };
  }
}