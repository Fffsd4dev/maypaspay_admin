import { useEffect, useState } from 'react';
import { listAdmins } from '@/api/admins';
import { getErrorMessage } from '@/api/client';

const STATUSES = ['active', 'invited', 'suspended'];

/**
 * Counts admins by status using the list endpoint's `meta.total`
 * (asks for 1 row per status, so it's cheap). Replace with a stats endpoint if the API adds one.
 */
export default function useStaffSummary() {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    Promise.all(STATUSES.map((status) => listAdmins({ status, per_page: 1 })))
      .then((responses) => {
        if (cancelled) return;
        setCounts(Object.fromEntries(STATUSES.map((status, i) => [status, responses[i].meta?.total ?? 0])));
      })
      .catch((err) => !cancelled && setError(getErrorMessage(err, 'Could not load staff counts.')))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  return { counts, loading, error };
}