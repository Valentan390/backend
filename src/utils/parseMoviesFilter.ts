import { ObjectId } from 'mongoose';

// Типизация для функции parsedNumber
const parsedNumber = (number: string | undefined): number | undefined => {
  if (typeof number !== 'string') return;

  const parseNumber = parseInt(number);

  if (Number.isNaN(parseNumber)) return;

  return parseNumber;
};

// Интерфейс для фильтров
interface MoviesFilter {
  minReleaseYear?: string;
  maxReleaseYear?: string;
}

// Интерфейс для возвращаемого значения фильтров
interface ParsedMoviesFilter {
  minReleaseYear?: number;
  maxReleaseYear?: number;
  userId?: ObjectId;
}

// Типизация для функции parseMoviesFilter
export const parseMoviesFilter = ({
  minReleaseYear,
  maxReleaseYear,
}: MoviesFilter): ParsedMoviesFilter => {
  const parsedMinReleaseYear = parsedNumber(minReleaseYear);
  const parsedMaxReleaseYear = parsedNumber(maxReleaseYear);

  return {
    minReleaseYear: parsedMinReleaseYear,
    maxReleaseYear: parsedMaxReleaseYear,
  };
};
