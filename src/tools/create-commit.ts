import { CreateCommitSchema } from '../schemas/index.js';
import { createCommit } from '../github/operations.js';
import { toHumanMessage } from '../errors/index.js';
import { logInfo, logError } from '../utils/logging.js';

export const createCommitTool = {
  name: 'create_commit',
  description:
    'Crea un commit agregando o modificando un archivo en un repositorio de GitHub. ' +
    'Usa este tool cuando el usuario quiera agregar un archivo nuevo, ' +
    'modificar el contenido de un archivo existente, o hacer un commit en un repositorio.',
  inputSchema: {
    type: 'object',
    properties: {
      owner: {
        type: 'string',
        description: 'Usuario u organización dueña del repositorio.',
      },
      repo: {
        type: 'string',
        description: 'Nombre del repositorio donde se hará el commit.',
      },
      message: {
        type: 'string',
        description: 'Mensaje descriptivo del commit.',
      },
      filename: {
        type: 'string',
        description: 'Ruta y nombre del archivo a crear o modificar. Ejemplo: src/index.ts',
      },
      content: {
        type: 'string',
        description: 'Contenido del archivo en texto plano.',
      },
    },
    required: ['owner', 'repo', 'message', 'filename', 'content'],
  },
};

export async function handleCreateCommit(args: unknown) {
  const parsed = CreateCommitSchema.safeParse(args);

  if (!parsed.success) {
    const message = parsed.error.issues.map(e => e.message).join(', ');
    return {
      content: [{ type: 'text' as const, text: `Error de validación: ${message}` }],
      isError: true,
    };
  }

  try {
    logInfo('Creando commit', { repo: parsed.data.repo, filename: parsed.data.filename });
    const result = await createCommit(parsed.data);
    return {
      content: [
        {
          type: 'text' as const,
          text: `Commit creado exitosamente.\nArchivo: ${parsed.data.filename}\nMensaje: ${parsed.data.message}\nURL: ${result.content?.html_url ?? 'N/A'}`,
        },
      ],
    };
  } catch (error) {
    logError('Error al crear commit', error);
    return {
      content: [{ type: 'text' as const, text: toHumanMessage(error) }],
      isError: true,
    };
  }
}