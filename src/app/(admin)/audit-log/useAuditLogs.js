import { useEffect, useState } from 'react';
import { listAuditLogs } from '@/api/audit';
import { getErrorMessage } from '@/api/client';

/**
 * Loads one page of audit entries for the given filters (only filters that are set are sent).
 * Pass enabled=false to skip loading (e.g. while the date range is invalid).
 */
export default function useAuditLogs(filters, page, perPage, enabled = true) {
  const [entries, setEntries] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    setError('');

    const params = { page, per_page: perPage };
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value != null) params[key] = value;
    });

    listAuditLogs(params)
      .then((res) => {
        if (cancelled) return;
        setEntries(res.data ?? []);
        setMeta(res.meta ?? null);
      })
      .catch((err) => !cancelled && setError(getErrorMessage(err, 'Could not load the audit log.')))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [filterKey, page, perPage, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return { entries, meta, loading, error };
}