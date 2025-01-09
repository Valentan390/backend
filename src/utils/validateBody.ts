import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import Joi from 'joi';

export const validateBody = (schema: Joi.ObjectSchema) => {
  const func = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body, {
        abortEarly: false,
      });
      next();
    } catch (error) {
      if (error instanceof Error) {
        next(createHttpError(400, error.message));
      } else {
        next(createHttpError(400, 'An unknown error occurred'));
      }
    }
  };

  return func;
};
