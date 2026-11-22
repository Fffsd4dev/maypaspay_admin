import { useCallback, useEffect, useState } from 'react';
import { listRoles } from '@/api/roles';
import { getErrorMessage } from '@/api/client';

/** Loads every role. Call `reload()` after a change. */
export default function useRolesList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    listRoles()
      .then((data) => !cancelled && setRoles(data ?? []))
      .catch((err) => !cancelled && setError(getErrorMessage(err, 'Could not load roles.')))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [reloadCount]);

  const reload = useCallback(() => setReloadCount((n) => n + 1), []);

  return { roles, loading, error, reload };
}