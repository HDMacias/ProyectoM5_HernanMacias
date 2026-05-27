import { CreateIssueSchema } from '../schemas/index.js';
import { createIssue } from '../github/operations.js';
import { toHumanMessage } from '../errors/index.js';
import { logInfo, logError } from '../utils/logging.js';

export const createIssueTool = {
  name: 'create_issue',
  description:
    'Abre un nuevo issue en un repositorio de GitHub. ' +
    'Usa este tool cuando el usuario quiera reportar un bug, ' +
    'solicitar una feature, o crear una tarea en un repositorio específico.',
  inputSchema: {
    type: 'object',
    properties: {
      owner: {
        type: 'string',
        description: 'Usuario u organización dueña del repositorio.',
      },
      repo: {
        type: 'string',
        description: 'Nombre del repositorio donde se creará el issue.',
      },
      title: {
        type: 'string',
        description: 'Título del issue. Debe ser claro y descriptivo.',
      },
      body: {
        type: 'string',
        description: 'Descripción detallada opcional del issue.',
      },
    },
    required: ['owner', 'repo', 'title'],
  },
};

export async function handleCreateIssue(args: unknown) {
  const parsed = CreateIssueSchema.safeParse(args);

  if (!parsed.success) {
    const message = parsed.error.issues.map(e => e.message).join(', ');
    return {
      content: [{ type: 'text' as const, text: `Error de validación: ${message}` }],
      isError: true,
    };
  }

  try {
    logInfo('Creando issue', { repo: parsed.data.repo, title: parsed.data.title });
    const issue = await createIssue(parsed.data);
    return {
      content: [
        {
          type: 'text' as const,
          text: `Issue #${issue.number} creado exitosamente.\nTítulo: ${issue.title}\nURL: ${issue.html_url}`,
        },
      ],
    };
  } catch (error) {
    logError('Error al crear issue', error);
    return {
      content: [{ type: 'text' as const, text: toHumanMessage(error) }],
      isError: true,
    };
  }
}