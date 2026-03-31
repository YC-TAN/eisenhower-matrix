import { z } from 'zod';

export interface ErrorResponse {
  error: string | z.ZodIssue[]; 
}