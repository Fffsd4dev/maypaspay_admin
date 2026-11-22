import { Pagination } from 'react-bootstrap';

/**
 * Prev/next pagination for API lists that return meta: { page, last_page, total }.
 * Reusable on any list page.
 */
const TablePagination = ({ meta, onPageChange }) => {
  if (!meta || meta.last_page <= 1) return null;
  const { page, last_page: lastPage, total } = meta;

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <span className="text-muted fs-13">
        Page {page} of {lastPage} · {total} total
      </span>
      <Pagination className="mb-0">
        <Pagination.Prev disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
        <Pagination.Item active>{page}</Pagination.Item>
        <Pagination.Next disabled={page >= lastPage} onClick={() => onPageChange(page + 1)} />
      </Pagination>
    </div>
  );
};

export default TablePagination;
