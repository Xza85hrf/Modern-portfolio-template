import { z } from 'zod';

// Project validation
export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(5000, 'Description too long'),
  image: z.string().min(1, 'Image is required'),
  technologies: z.array(z.string().max(50)).max(20, 'Too many technologies').default([]),
  link: z.string().url('Invalid link URL').optional().nullable(),
  githubLink: z.string().url('Invalid GitHub URL').optional().nullable(),
  metadata: z.record(z.unknown()).optional().default({}),
});

export const projectUpdateSchema = projectSchema.partial();

// Message/Contact form validation
export const messageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address').max(254, 'Email too long'),
  message: z.string().min(1, 'Message is required').max(5000, 'Message too long'),
});

// Comment validation
export const commentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address').max(254, 'Email too long'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content too long'),
});

// Blog post validation
export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300, 'Title too long'),
  content: z.record(z.unknown()), // JSON content from TipTap editor (required)
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  tags: z.array(z.string().max(50)).max(10, 'Too many tags').default([]),
});

export const postUpdateSchema = postSchema.partial();

// Skill validation
export const skillSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  category: z.string().min(1, 'Category is required').max(50, 'Category too long'),
  proficiency: z.number().int().min(0).max(100, 'Proficiency must be 0-100'),
});

// Login validation
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username too long'),
  password: z.string().min(1, 'Password is required').max(128, 'Password too long'),
});

// Analytics validation
export const pageviewSchema = z.object({
  pagePath: z.string().min(1, 'Page path is required').max(500, 'Path too long'),
  sessionDuration: z.number().int().min(0).optional().nullable(),
  browserInfo: z.string().max(100).optional().nullable(),
});

// Helper function for validation
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodIssue[] } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.issues };
}

// Helper to format validation errors for API response
export function formatValidationErrors(errors: z.ZodIssue[]): string {
  return errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
}
