import { ObjectId, UpdateQuery } from 'mongoose';
import MovieCollection from '../db/models/Movie.js';
import { GetMoviesParams, Movie } from '../types/params.js';

import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getMovies = async ({
  page,
  perPage: limit,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}: GetMoviesParams) => {
  const skip = (page - 1) * limit;

  const moviesQuery = MovieCollection.find()
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });

  if (filter.minReleaseYear) {
    moviesQuery.where('releaseYear').gte(filter.minReleaseYear);
  }

  if (filter.maxReleaseYear) {
    moviesQuery.where('releaseYear').lte(filter.maxReleaseYear);
  }

  if (filter.userId) {
    moviesQuery.where('userId').equals(filter.userId);
  }

  const data = await moviesQuery;
  const count = await MovieCollection.find()
    .merge(moviesQuery)
    .countDocuments();

  const paginationData = calcPaginationData({
    count,
    page,
    perPage: limit,
  });

  return {
    page,
    perPage: limit,
    ...paginationData,
    data,
    count,
  };
};

// interface IGetMovieById {
//   _id: string;
//   userId: ObjectId;
// }

export const getMovieById = (id: string) => MovieCollection.findById(id);

interface GetMovieParams {
  _id: string;
  userId: ObjectId;
}

export const getMovie = (filter: GetMovieParams) =>
  MovieCollection.findOne(filter);

export const addMovie = (payload: Movie) => MovieCollection.create(payload);

export const updateMovieById = async (
  _id: string,
  payload: UpdateQuery<Movie>,
  options = {},
) => {
  const result = await MovieCollection.findOneAndUpdate({ _id }, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!result || !result.value) return null;

  return {
    data: result.value,
    isNew: Boolean(result.lastErrorObject?.upserted),
  };
};

export const updateMovie = async (
  filter: GetMovieParams,
  payload: UpdateQuery<Movie>,
  options = {},
) => {
  const result = await MovieCollection.findOneAndUpdate(filter, payload, {
    includeResultMetadata: true,
    ...options,
  });

  if (!result || !result.value) return null;

  return {
    data: result.value,
    isNew: Boolean(result.lastErrorObject?.upserted),
  };
};

export const deleteMovieById = (_id: string) =>
  MovieCollection.findOneAndDelete({ _id });

export const deleteMovie = (filter: GetMovieParams) =>
  MovieCollection.findOneAndDelete(filter);
