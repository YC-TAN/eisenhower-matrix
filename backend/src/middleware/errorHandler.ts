import { Response, Request, NextFunction } from "express";
import {z} from 'zod';
import { logger, toError } from "src/utils/logger";
import { NotFoundError } from "../utils/errors";
import { ErrorResponse } from "src/types/api";

export const unknownEndpoint = (_req: Request, res: Response<ErrorResponse>) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

// For standarc JS errors without HTTP codes
const isNativeError = (error: unknown): error is { name: string; message: string } =>
  typeof error === 'object' &&
  error !== null &&
  'name' in error &&
  'message' in error;

  // For API errors
const hasStatusCode = (error: unknown): error is { statusCode: number; message: string } =>
  typeof error === 'object' &&
  error !== null &&
  'statusCode' in error &&
  'message' in error;

export const errorMiddleware = (
  error: unknown, 
  _req: Request, 
  res: Response<ErrorResponse>, 
  next: NextFunction
) => { 
  logger.error('Unhandled error:', toError(error));
  
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
    return;
  } 

  if (error instanceof NotFoundError) {
    res.status(404).json({ error: error.message });
    return;
  }

  if (hasStatusCode(error)) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  if (!isNativeError(error)) {
    next(error);
    return;
  }

  const err = toError(error);
  
  switch (err.name) {
    case 'CastError':
      res.status(400).json({ error: 'Malformatted id' });
      return;
    case 'ValidationError': // Mongo schema validation
      res.status(400).json({ error: error.message });
      return;
    case 'MongoServerError':
      if (error.message.includes('E11000')) {
        res.status(409).json({ error: 'Duplicate key error' });
        return;
      }
      break;
    case 'SyntaxError':
      res.status(400).json({ error: 'Invalid JSON' });
      return;
  }

  logger.error("Final fallback error:", err.message);
  res.status(500).json({ error: 'An unexpected error occurred.' });
};