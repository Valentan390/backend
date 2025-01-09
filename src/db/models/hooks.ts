// import { CallbackError } from 'mongoose';
// import { NextFunction } from 'express';
// import { Query } from 'mongoose';

// export const handleSaveError = (
//   error: CallbackError & { code?: number; name?: string; status?: number } | null,
//   data: string,
//   next: NextFunction,
// ) => {
//   const { code, name } = error;
//   error.status = code === 11000 && name === 'MongoServerError' ? 409 : 400;
//   next();
// };

// export const setUpdateSettings = function (
//   this: Query<any, any>,
//   next: NextFunction,
// ) {
//   this.options.runValidators = true;
//   this.options.new = true;
//   next();
// };

// export const handleSaveError = (
//   error:
//     | (CallbackError & { code?: number; name?: string; status?: number })
//     | null,
//   data: string,
//   next: NextFunction,
// ) => {
//   if (error) {
//     const { code, name } = error;
//     error.status = code === 11000 && name === 'MongoServerError' ? 409 : 400;
//   }
//   next();
// };

// export const setUpdateSettings = function (
//   this: Query<any, any>,
//   next: NextFunction,
// ) {
//   this.setOptions({
//     runValidators: true,
//     new: true,
//   });
//   next();
// };

import {
  CallbackError,
  CallbackWithoutResultAndOptionalError,
  Document,
  Query,
} from 'mongoose';
import { Movie } from '../../types/params';

export const handleSaveError = (
  error: CallbackError & { code?: number; name?: string; status?: number },
  doc: Document,
  next: CallbackWithoutResultAndOptionalError,
) => {
  const { code, name } = error;
  error.status = code === 11000 && name === 'MongoServerError' ? 409 : 400;
  next();
};

export const setUpdateSettings = function (
  this: Query<Movie, Movie>,
  next: CallbackWithoutResultAndOptionalError,
) {
  this.setOptions({ runValidators: true, new: true });
  next();
};
