const sortOrderList = ['asc', 'desc'] as const;

type SortOrder = (typeof sortOrderList)[number];

interface SortParamsInput {
  sortBy?: string;
  sortOrder?: string;
  sortByList: string[];
}

interface SortParams {
  sortBy: string;
  sortOrder: SortOrder;
}

export const parseSortParams = ({
  sortBy,
  sortOrder,
  sortByList,
}: SortParamsInput): SortParams => {
  const parsedSortOrder: SortOrder = sortOrderList.includes(
    sortOrder as SortOrder,
  )
    ? (sortOrder as SortOrder)
    : sortOrderList[0];
  const parsedSortBy: string = sortByList.includes(sortBy || '')
    ? sortBy!
    : '_id';

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
