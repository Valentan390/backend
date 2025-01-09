const parseNumber = (
  number: string | undefined,
  defaultValue: number,
): number => {
  if (typeof number !== 'string') return defaultValue;

  const parsedNumber = parseInt(number);

  if (Number.isNaN(parsedNumber)) return defaultValue;

  return parsedNumber;
};

interface PaginationQuery {
  page?: string;
  perPage?: string;
}

interface PaginationParams {
  page: number;
  perPage: number;
}

export const parsePaginationParams = (
  query: PaginationQuery,
): PaginationParams => {
  const { page, perPage } = query;
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
