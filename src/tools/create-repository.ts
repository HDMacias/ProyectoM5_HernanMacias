import { CreateRepositorySchema } from '../schemas/index.js';
import { createRepository } from '../github/operations.js';
import { toHumanMessage } from '../errors/index.js';
import { logInfo, logError } from '../utils/logging.js';

export const createRepositoryTool = {
  name: 'create_repository',
  description:
    'Crea un nuevo repositorio en GitHub para el usuario autenticado. ' +
    'Usa este tool cuando el usuario quiera crear un repositorio nuevo, ' +
    'inicializar un proyecto en GitHub, o crear un repo con nombre y descripción.',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Nombre del repositorio. Solo letras, números, guiones y puntos. Entre 3 y 100 caracteres.',
      },
      description: {
        type: 'string',
        description: 'Descripción opcional del repositorio.',
      },
      isPrivate: {
        type: 'boolean',
        description: 'Si es true el repositorio será privado. Por defecto es público.',
      },
    },
    required: ['name'],
  },
};

export async function handleCreateRepository(args: unknown) {
  const parsed = CreateRepositorySchema.safeParse(args);

  if (!parsed.success) {
    const message = parsed.error.errors.map(e => e.message).join(', ');
    return {
      content: [{ type: 'text', text: `Error de validación: ${message}` }],
      isError: true,
    };
  }

  try {
    logInfo('Creando repositorio', { name: parsed.data.name });
    const repo = await createRepository(parsed.data);
    return {
      content: [
        {
          type: 'text',
          text: `Repositorio "${repo.name}" creado exitosamente.\nURL: ${repo.html_url}\nVisibilidad: ${repo.private ? 'Privado' : 'Público'}`,
        },
      ],
    };
  } catch (error) {
    logError('Error al crear repositorio', error);
    return {
      content: [{ type: 'text', text: toHumanMessage(error) }],
      isError: true,
    };
  }
}