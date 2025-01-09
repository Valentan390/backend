export const calcPaginationData = ({
  count,
  perPage,
  page,
}: {
  count: number;
  perPage: number;
  page: number;
}) => {
  const totalPages = Math.ceil(count / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};
