// import { ParamsDictionary } from 'express-serve-static-core';
import { ObjectId } from 'mongoose';
// import { Request } from 'express';

export interface User {
  _id: string;
}

// export interface ParamsWithId extends ParamsDictionary {
//   id: string;
//   user: User;
// }

// export interface ParamsWithId {
//   id: string;
//   user: User;
// }

// export interface ParamsWithId extends ParamsDictionary {
//   id: string;
//   user: string; // Значения должны быть строками для совместимости с ParamsDictionary
// }

// export interface CustomRequest extends Request {
//   params: ParamsWithId; // Заменяем ParamsDictionary на ParamsWithId
//   user: User;
// }

export interface Movie {
  title: string;
  director: string;
  type: string;
  releaseYear?: number;
  poster?: string;
  userId: ObjectId;
}

export interface GetMoviesParams {
  page: number;
  perPage: number;
  sortBy?: string | '_id';
  sortOrder?: 'asc' | 'desc';
  filter?: {
    minReleaseYear?: number;
    maxReleaseYear?: number;
    userId?: ObjectId;
  };
}
