import { ListRepositoriesSchema } from '../schemas/index.js';
import { listRepositories } from '../github/operations.js';
import { toHumanMessage } from '../errors/index.js';
import { logInfo, logError } from '../utils/logging.js';

export const listRepositoriesTool = {
  name: 'list_repositories',
  description:
    'Lista los repositorios del usuario autenticado en GitHub. ' +
    'Usa este tool cuando el usuario quiera ver sus repositorios, ' +
    'consultar qué proyectos tiene en GitHub, o buscar un repositorio propio.',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'Cantidad máxima de repositorios a retornar. Por defecto 30, máximo 100.',
      },
    },
    required: [],
  },
};

export async function handleListRepositories(args: unknown) {
  const parsed = ListRepositoriesSchema.safeParse(args);

  if (!parsed.success) {
    const message = parsed.error.issues.map(e => e.message).join(', ');
    return {
      content: [{ type: 'text' as const, text: `Error de validación: ${message}` }],
      isError: true,
    };
  }

  try {
    logInfo('Listando repositorios');
    const repos = await listRepositories(parsed.data);

    if (repos.length === 0) {
      return {
        content: [{ type: 'text' as const, text: 'No se encontraron repositorios.' }],
      };
    }

    const repoList = repos
      .map((r: { name: string; private: boolean; html_url: string }) => `- ${r.name} (${r.private ? 'Privado' : 'Público'}) → ${r.html_url}`)
      .join('\n');

    return {
      content: [
        {
          type: 'text' as const,
          text: `Se encontraron ${repos.length} repositorios:\n\n${repoList}`,
        },
      ],
    };
  } catch (error) {
    logError('Error al listar repositorios', error);
    return {
      content: [{ type: 'text'as const, text: toHumanMessage(error) }],
      isError: true,
    };
  }
}