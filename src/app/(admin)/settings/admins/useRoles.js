import { useEffect, useState } from 'react';
import { listRoles } from '@/api/roles';

/** Loads the list of roles once (for filters and role pickers). */
export default function useRoles() {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listRoles()
      .then((data) => !cancelled && setRoles(data ?? []))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  return { roles, rolesError: error };
}
