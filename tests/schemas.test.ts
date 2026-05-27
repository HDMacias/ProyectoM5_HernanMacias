import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  CreateRepositorySchema,
  CreateIssueSchema,
  ListRepositoriesSchema,
  CreateCommitSchema,
  ListIssuesSchema,
} from '../src/schemas/index.js';
import {
  ValidationError,
  GitHubAPIError,
  AuthenticationError,
  NetworkError,
  toHumanMessage,
} from '../src/errors/index.js';

// ===== TESTS DE SCHEMAS =====

describe('CreateRepositorySchema', () => {
  it('acepta un nombre válido', () => {
    const result = CreateRepositorySchema.safeParse({ name: 'mi-proyecto' });
    expect(result.success).toBe(true);
  });

  it('rechaza un nombre menor a 3 caracteres', () => {
    const result = CreateRepositorySchema.safeParse({ name: 'ab' });
    expect(result.success).toBe(false);
  });

  it('rechaza un nombre con caracteres inválidos', () => {
    const result = CreateRepositorySchema.safeParse({ name: 'mi proyecto' });
    expect(result.success).toBe(false);
  });

  it('acepta descripción opcional', () => {
    const result = CreateRepositorySchema.safeParse({
      name: 'valid-repo',
      description: 'Una descripción válida',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza descripción mayor a 350 caracteres', () => {
    const longDesc = 'a'.repeat(351);
    const result = CreateRepositorySchema.safeParse({
      name: 'valid-repo',
      description: longDesc,
    });
    expect(result.success).toBe(false);
  });
});

describe('CreateIssueSchema', () => {
  it('acepta parámetros válidos', () => {
    const result = CreateIssueSchema.safeParse({
      owner: 'HDMacias',
      repo: 'mi-proyecto',
      title: 'Bug en el login',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza si falta el título', () => {
    const result = CreateIssueSchema.safeParse({
      owner: 'HDMacias',
      repo: 'mi-proyecto',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza título vacío', () => {
    const result = CreateIssueSchema.safeParse({
      owner: 'HDMacias',
      repo: 'mi-proyecto',
      title: '',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza título mayor a 256 caracteres', () => {
    const result = CreateIssueSchema.safeParse({
      owner: 'HDMacias',
      repo: 'mi-proyecto',
      title: 'a'.repeat(257),
    });
    expect(result.success).toBe(false);
  });
});

describe('ListRepositoriesSchema', () => {
  it('acepta limit opcional', () => {
    const result = ListRepositoriesSchema.safeParse({ limit: 10 });
    expect(result.success).toBe(true);
  });

  it('acepta sin parámetros', () => {
    const result = ListRepositoriesSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('rechaza limit mayor a 100', () => {
    const result = ListRepositoriesSchema.safeParse({ limit: 101 });
    expect(result.success).toBe(false);
  });

  it('rechaza limit menor a 1', () => {
    const result = ListRepositoriesSchema.safeParse({ limit: 0 });
    expect(result.success).toBe(false);
  });
});

describe('CreateCommitSchema', () => {
  it('acepta parámetros válidos', () => {
    const result = CreateCommitSchema.safeParse({
      owner: 'HDMacias',
      repo: 'mi-proyecto',
      message: 'feat: agrego archivo',
      filename: 'README.md',
      content: '# Mi proyecto',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza si falta el mensaje', () => {
    const result = CreateCommitSchema.safeParse({
      owner: 'HDMacias',
      repo: 'mi-proyecto',
      message: '',
      filename: 'README.md',
      content: '# Mi proyecto',
    });
    expect(result.success).toBe(false);
  });
});

describe('ListIssuesSchema', () => {
  it('acepta owner y repo válidos', () => {
    const result = ListIssuesSchema.safeParse({
      owner: 'HDMacias',
      repo: 'mi-proyecto',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza si falta el owner', () => {
    const result = ListIssuesSchema.safeParse({
      repo: 'mi-proyecto',
    });
    expect(result.success).toBe(false);
  });
});

// ===== TESTS DE MANEJO DE ERRORES =====

describe('Error Handling', () => {
  describe('ValidationError', () => {
    it('crea un error de validación con mensaje', () => {
      const error = new ValidationError('El nombre es requerido');
      expect(error.name).toBe('validationError');
      expect(error.message).toBe('El nombre es requerido');
    });

    it('transforma ValidationError a mensaje humano', () => {
      const error = new ValidationError('El nombre es requerido');
      const msg = toHumanMessage(error);
      expect(msg).toContain('Error de validación');
    });
  });

  describe('AuthenticationError', () => {
    it('crea un error de autenticación', () => {
      const error = new AuthenticationError('Token inválido');
      expect(error.name).toBe('AuthenticationError');
      expect(error.message).toBe('Token inválido');
    });

    it('transforma AuthenticationError a mensaje humano', () => {
      const error = new AuthenticationError('Token inválido');
      const msg = toHumanMessage(error);
      expect(msg).toContain('Token de GitHub invalido o expirado');
    });
  });

  describe('GitHubAPIError - errores 4xx/5xx', () => {
    it('maneja error 404 (recurso no encontrado)', () => {
      const error = new GitHubAPIError('Not Found', 404);
      const msg = toHumanMessage(error);
      expect(msg).toContain('Recurso no encontrado');
    });

    it('maneja error 422 (datos inválidos)', () => {
      const error = new GitHubAPIError('Unprocessable Entity', 422);
      const msg = toHumanMessage(error);
      expect(msg).toContain('Datos invalidos para GitHub');
    });

    it('maneja error 403 (sin permisos)', () => {
      const error = new GitHubAPIError('Forbidden', 403);
      const msg = toHumanMessage(error);
      expect(msg).toContain('Sin permisos');
    });

    it('maneja error 401 (no autorizado)', () => {
      const error = new GitHubAPIError('Unauthorized', 401);
      const msg = toHumanMessage(error);
      expect(msg).toContain('No autorizado');
    });

    it('maneja error 429 (rate limit)', () => {
      const error = new GitHubAPIError('Too Many Requests', 429);
      const msg = toHumanMessage(error);
      expect(msg).toContain('Limite de requests');
    });
  });

  describe('NetworkError', () => {
    it('crea un error de red', () => {
      const error = new NetworkError('Connection timeout');
      expect(error.name).toBe('NetworkError');
      expect(error.message).toBe('Connection timeout');
    });

    it('transforma NetworkError a mensaje humano', () => {
      const error = new NetworkError('Connection timeout');
      const msg = toHumanMessage(error);
      expect(msg).toContain('Error de conexión');
    });
  });

  describe('Errores generales', () => {
    it('maneja Error genérico', () => {
      const error = new Error('Algo salió mal');
      const msg = toHumanMessage(error);
      expect(msg).toContain('Error inesperado');
    });

    it('maneja valor desconocido', () => {
      const msg = toHumanMessage(null);
      expect(msg).toBe('Ocurrió un error desconocido');
    });
  });
});