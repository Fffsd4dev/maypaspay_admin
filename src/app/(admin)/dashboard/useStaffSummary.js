import { useEffect, useState } from 'react';
import { listAdmins } from '@/api/admins';
import { getErrorMessage } from '@/api/client';

const STATUSES = ['active', 'invited', 'suspended'];
const MAX_PER_PAGE = 100; // the API's limit for per_page

/**
 * Counts admins by status.
 *
 * Usually ONE call: fetch up to 100 admins and count them here.
 * Only if there are more than 100 admins does it fall back to one small call per status
 * (asking for 1 row and reading `meta.total`).
 * Replace all of this with a stats endpoint if the API adds one.
 */
async function loadCounts() {
  const first = await listAdmins({ per_page: MAX_PER_PAGE });
  const total = first.meta?.total ?? first.data?.length ?? 0;

  if (total <= MAX_PER_PAGE) {
    const counts = Object.fromEntries(STATUSES.map((status) => [status, 0]));
    (first.data ?? []).forEach((admin) => {
      if (admin.status in counts) counts[admin.status] += 1;
    });
    return counts;
  }

  // More than 100 admins: counting one page would be wrong, so ask per status.
  const responses = await Promise.all(STATUSES.map((status) => listAdmins({ status, per_page: 1 })));
  return Object.fromEntries(STATUSES.map((status, i) => [status, responses[i].meta?.total ?? 0]));
}

export default function useStaffSummary() {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    loadCounts()
      .then((result) => !cancelled && setCounts(result))
      .catch((err) => !cancelled && setError(getErrorMessage(err, 'Could not load staff counts.')))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  return { counts, loading, error };
}