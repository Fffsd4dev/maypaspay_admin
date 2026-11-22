import { useCallback, useEffect, useState } from 'react';
import { listAdmins } from '@/api/admins';
import { getErrorMessage } from '@/api/client';

/**
 * Loads one page of admins for the given filters.
 * Call `reload()` after an action to refresh the list.
 */
export default function useAdmins(filters) {
  const [admins, setAdmins] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  const { status, roleId, search, page, perPage } = filters;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    // Only send the filters that are set.
    const params = { page, per_page: perPage };
    if (status) params.status = status;
    if (roleId) params.role_id = roleId;
    if (search) params.search = search;

    listAdmins(params)
      .then((res) => {
        if (cancelled) return;
        setAdmins(res.data ?? []);
        setMeta(res.meta ?? null);
      })
      .catch((err) => !cancelled && setError(getErrorMessage(err, 'Could not load admins.')))
      .finally(() => !cancelled && setLoading(false));

    // Ignore the response if filters change before it arrives.
    return () => {
      cancelled = true;
    };
  }, [status, roleId, search, page, perPage, reloadCount]);

  const reload = useCallback(() => setReloadCount((n) => n + 1), []);

  return { admins, meta, loading, error, reload };
}
