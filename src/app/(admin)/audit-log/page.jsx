/**
 * Audit log: who did what, newest first.
 * Route: /audit-log (needs audit.view)
 */
import { useEffect, useState } from 'react';
import { Alert, Card, CardBody, Spinner } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import TablePagination from '@/components/TablePagination';
import useDebounce from '@/hooks/useDebounce';
import AuditDetails from './components/AuditDetails';
import AuditFilters from './components/AuditFilters';
import AuditTable from './components/AuditTable';
import useAuditLogs from './useAuditLogs';

const PER_PAGE = 25;

// Keys match the API's query parameters, so they can be sent as they are.
const EMPTY_FILTERS = {
  from: '',
  to: '',
  action: '',
  actor_type: '',
  actor_id: '',
  entity_type: '',
  entity_id: '',
  request_id: '',
};

const AuditLogPage = () => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [seenActions, setSeenActions] = useState([]); // suggestions for the Action filter

  // Wait until the user stops typing before loading.
  const debouncedFilters = useDebounce(filters);
  const rangeInvalid = Boolean(filters.from && filters.to && filters.from > filters.to);
  const { entries, meta, loading, error } = useAuditLogs(debouncedFilters, page, PER_PAGE, !rangeInvalid);

  // Remember every action name we've seen, to suggest them in the filter.
  useEffect(() => {
    setSeenActions((current) => [...new Set([...current, ...entries.map((e) => e.action)])].sort());
  }, [entries]);

  // Changing any filter goes back to page 1.
  const updateFilters = (changes) => {
    setFilters((current) => ({ ...current, ...changes }));
    setPage(1);
  };

  // Shortcuts from the details panel: show related entries (keeps the date range, clears the rest).
  const showRelated = (changes) => {
    setFilters((current) => ({ ...EMPTY_FILTERS, from: current.from, to: current.to, ...changes }));
    setPage(1);
  };

  return (
    <>
      <PageTitle title="Audit log" subTitle="Administration" />

      <Card>
        <CardBody>
          <div className="mb-3">
            <h5 className="mb-1">Activity</h5>
            <p className="text-muted mb-0 fs-13">Every sensitive action on the platform, newest first. Click an entry for full details.</p>
          </div>

          <AuditFilters
            filters={filters}
            onChange={updateFilters}
            onReset={() => updateFilters(EMPTY_FILTERS)}
            actionSuggestions={seenActions}
          />

          {rangeInvalid && <Alert variant="warning" className="py-2">The "From" date is after the "To" date.</Alert>}
          {error && !rangeInvalid && <Alert variant="danger" className="py-2">{error}</Alert>}

          {!rangeInvalid &&
            (loading ? (
              <div className="text-center py-5">
                <Spinner />
              </div>
            ) : entries.length === 0 ? (
              !error && <p className="text-center text-muted py-5 mb-0">No activity matches these filters.</p>
            ) : (
              <AuditTable entries={entries} onOpen={setSelected} />
            ))}

          {!rangeInvalid && !loading && <TablePagination meta={meta} onPageChange={setPage} />}
        </CardBody>
      </Card>

      <AuditDetails entry={selected} onClose={() => setSelected(null)} onFilter={showRelated} />
    </>
  );
};

export default AuditLogPage;