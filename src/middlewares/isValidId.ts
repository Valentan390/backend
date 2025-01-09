import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';
// import { ParamsWithId } from '../types/params';

export const isValidId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  console.log(req.params);

  if (!isValidObjectId(id)) {
    return next(createHttpError(404, `${id} not valid id`));
  }
  next();
};
