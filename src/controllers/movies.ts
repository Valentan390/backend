import createHttpError from 'http-errors';
import { Request, Response } from 'express';
import * as path from 'node:path';

import * as movieServices from '../services/movies.js';
import { Movie } from '../types/params.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseMoviesFilter } from '../utils/parseMoviesFilter.js';
import { saveFileToUploadsDir } from '../utils/saveFileToUploadsDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

import { sortByListMovie } from '../db/models/Movie.js';

const enable_cloudinary = env('ENABLE_CLOUDINARY') === 'true';

export const getMoviesController = async (req: Request, res: Response) => {
  // const { page, perPage, sortBy, sortOrder } = req.query;

  const { _id: userId } = req.user;

  const { sortBy, sortOrder } = parseSortParams({
    ...req.query,
    sortByList: sortByListMovie,
  });
  const { page, perPage } = parsePaginationParams(req.query);

  const filter = parseMoviesFilter(req.query);
  filter.userId = userId;

  const data = await movieServices.getMovies({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully get movies',
    data,
  });
};

export const getMovieByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { _id: userId } = req.user;

  const data = await movieServices.getMovie({ _id: id, userId });

  if (!data) {
    throw createHttpError(404, `Movie with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: `Movie with id=${id} get successfully`,
    data,
  });
};

interface AddMovieRequest extends Request {
  body: Movie;
  file?: Express.Multer.File;
}

export const addMovieController = async (
  req: AddMovieRequest,
  res: Response,
) => {
  const { _id: userId } = req.user;

  let poster = '';
  if (req.file) {
    if (enable_cloudinary) {
      poster = await saveFileToCloudinary(req.file);
    } else {
      await saveFileToUploadsDir(req.file, 'posters');
      poster = path.join('posters', req.file.filename);
    }
  }

  const data = await movieServices.addMovie({ ...req.body, poster, userId });

  res.status(201).json({
    status: 201,
    message: 'Movie add successfully',
    data,
  });
};

export const upsertMovieController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { _id: userId } = req.user;

  const result = await movieServices.updateMovie(
    { _id: id, userId },
    { ...req.body, userId },
    { upsert: true },
  );

  if (!result) {
    throw createHttpError(404, `Movie not created`);
  }

  const { data, isNew } = result;

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Movie upsert successfully',
    data,
  });
};

export const patchMovieController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { _id: userId } = req.user;

  const result = await movieServices.updateMovie({ _id: id, userId }, req.body);

  if (!result) {
    throw createHttpError(404, `Movie with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: 'Movie patch successfully',
    data: result.data,
  });
};

export const deleteMovieController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await movieServices.deleteMovie({ _id: id, userId });

  if (!data) {
    throw createHttpError(404, `Movie with id=${id} not found`);
  }

  res.status(204).send();
};
