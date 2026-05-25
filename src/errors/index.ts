export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'validationError';
  }
}

export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class NetworKError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export function toHumanMessage(error: unknown): string {
  if (error instanceof AuthenticationError) {
    return 'Token de GitHub invalido o expirado. Verifica tu GITHUB_TOKEN en el archivo .env';
  }

  if (error instanceof ValidationError) {
    return 'Error de validación: ${error.message}';
  }

  if (error instanceof GitHubAPIError) {
    if (error.statusCode === 404) {
      return 'Recurso no encontrado. Verifica que el repositorio o usuario exista.';
    }


    if (error.statusCode === 422) {
      return 'Datos invalidos para GitHub. ${error.message}';
    }

    if (error.statusCode === 403) {
      return 'Sin permisos para realizar esta acción. Verifica los scopes de tu token';
    }
    return 'Error de GitHub: ${error.message}';
  }

  if (error instanceof NetworKError) {
    return 'Error de conexión. Verifica tu internet e intenta de nuevo';
  }
  if (error instanceof Error) {
    return 'Error inesperado: ${error.message}';
  }
  return 'Ocurrió un error desconocido';
}