// import { Request, Response, NextFunction } from 'express';

// const parseNumber = (number: string | undefined, defaultValue: number) => {
//   if (typeof number !== 'string') return defaultValue;

//   const parsedNumber = parseInt(number);

//   if (Number.isNaN(parsedNumber)) return defaultValue;

//   return parsedNumber;
// };

// export const parsePaginationParams = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): void => {
//   const { page, perPage } = req.query;
//   const parsedPage = parseNumber(page as string | undefined, 1);
//   const parsedPerPage = parseNumber(perPage as string | undefined, 10);

//   req.query = { ...req.query, page: parsedPage, perPage: parsedPerPage };
//   next();
// };
