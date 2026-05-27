import { z } from 'zod';

const repoNameSchema = z
  .string()
  .min(3, 'El nombre debe tener al menos 3 caracteres')
  .max(100, 'El nombre no puede superar los 100 caracteres')
  .regex(/^[a-zA-Z0-9_.-]+$/,
    'Solo se permiten letras, números, guiones, puntos y guiones bajos'
  );

const ownerSchema = z
  .string()
  .min(1, 'El owner es requerido');

export const CreateRepositorySchema = z.object({
  name: repoNameSchema,
  description: z.string().max(350).optional(),
  isPrivate: z.boolean().optional(),
});

export const CreateIssueSchema = z.object({
  owner: ownerSchema,
  repo: repoNameSchema,
  title: z
    .string()
    .min(1, 'El título del issue es requerido')
    .max(256, 'El título no puede superar los 256 caracteres'),
  body: z.string().optional(),
});

export const ListRepositoriesSchema = z.object({
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional(),
});

export const CreateCommitSchema = z.object({
  owner: ownerSchema,
  repo: repoNameSchema,
  message: z
    .string()
    .min(1, 'El mensaje del commit es requerido'),
  filename: z
    .string()
    .min(1, 'El nombre del archivo es requerido'),
  content: z
    .string()
    .min(1, 'El contenido del archivo es requerido'),
});

export const ListIssuesSchema = z.object({
  owner: ownerSchema,
  repo: repoNameSchema,
});

export type CreateRepositoryInput = z.infer<typeof CreateRepositorySchema>;
export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;
export type ListRepositoriesInput = z.infer<typeof ListRepositoriesSchema>;
export type CreateCommitInput = z.infer<typeof CreateCommitSchema>;
export type ListIssuesInput = z.infer<typeof ListIssuesSchema>;