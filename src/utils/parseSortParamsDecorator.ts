import { Request, Response, NextFunction } from 'express';

const sortOrderList = ['asc', 'desc'];

export const parseSortParamsDecorator = (sortByList: string[]) => {
  const func = (req: Request, res: Response, next: NextFunction) => {
    const { sortOrder, sortBy } = req.query;

    const parsedSortOrder =
      typeof sortOrder === 'string' && sortOrderList.includes(sortOrder)
        ? sortOrder
        : sortOrderList[0];

    const parsedSortBy =
      typeof sortBy === 'string' && sortByList.includes(sortBy)
        ? sortBy
        : '_id';

    req.query = {
      ...req.query,
      sortBy: parsedSortBy,
      sortOrder: parsedSortOrder,
    };

    next();
  };

  return func;
};
