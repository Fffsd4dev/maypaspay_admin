import { useEffect, useState } from 'react';
import { listPermissions } from '@/api/roles';
import { getErrorMessage } from '@/api/client';

/** Loads every permission, grouped: { kyc: [{ name, label }], ... } */
export default function usePermissionGroups() {
  const [groups, setGroups] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    listPermissions()
      .then((data) => !cancelled && setGroups(data ?? {}))
      .catch((err) => !cancelled && setError(getErrorMessage(err, 'Could not load permissions.')));
    return () => {
      cancelled = true;
    };
  }, []);

  return { groups, error };
}