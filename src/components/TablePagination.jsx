import { Pagination } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

/** Which page numbers to show: up to 5 around the current page, e.g. [3, 4, 5, 6, 7]. */
const pageWindow = (page, lastPage, size = 5) => {
  const start = Math.max(1, Math.min(page - Math.floor(size / 2), lastPage - size + 1));
  return Array.from({ length: Math.min(size, lastPage) }, (_, i) => start + i);
};

/**
 * "Showing 1–25 of 33" plus page buttons, for API lists that return
 * meta: { page, per_page, total, last_page }. Reusable on any list page.
 */
const TablePagination = ({ meta, onPageChange }) => {
  if (!meta || !meta.total) return null;
  const { page, per_page: perPage, total, last_page: lastPage } = meta;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
      <span className="text-muted fs-13">
        Showing {from}–{to} of {total}
      </span>
      {lastPage > 1 && (
        <Pagination className="data-pagination">
          <Pagination.Item disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
            <IconifyIcon icon="tabler:chevron-left" />
          </Pagination.Item>
          {pageWindow(page, lastPage).map((number) => (
            <Pagination.Item key={number} active={number === page} onClick={() => onPageChange(number)}>
              {number}
            </Pagination.Item>
          ))}
          <Pagination.Item disabled={page >= lastPage} onClick={() => onPageChange(page + 1)} aria-label="Next page">
            <IconifyIcon icon="tabler:chevron-right" />
          </Pagination.Item>
        </Pagination>
      )}
    </div>
  );
};

export default TablePagination;