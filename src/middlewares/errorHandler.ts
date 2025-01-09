import { Request, Response, NextFunction } from 'express';

interface ExtendedError extends Error {
  status?: number;
}

export const errorHandler = (
  error: ExtendedError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  res.status(status).json({
    status,
    message,
  });
};
