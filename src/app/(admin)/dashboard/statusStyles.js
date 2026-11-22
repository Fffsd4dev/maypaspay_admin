/**
 * How each status looks: Bootstrap colour + icon + label.
 * A status is never shown by colour alone; the icon and label always come with it.
 */
export const TRANSACTION_STATUS = {
  successful: { variant: 'success', icon: 'tabler:circle-check', label: 'Successful' },
  pending: { variant: 'warning', icon: 'tabler:clock', label: 'Pending' },
  failed: { variant: 'danger', icon: 'tabler:circle-x', label: 'Failed' },
  flagged: { variant: 'danger', icon: 'tabler:flag', label: 'Flagged' },
};

export const ALERT_SEVERITY = {
  critical: { variant: 'danger', icon: 'tabler:alert-octagon', label: 'Critical' },
  serious: { variant: 'warning', icon: 'tabler:alert-triangle', label: 'Serious' },
  warning: { variant: 'info', icon: 'tabler:info-circle', label: 'Warning' },
};

export const SERVICE_STATUS = {
  operational: { variant: 'success', icon: 'tabler:circle-check', label: 'Operational' },
  degraded: { variant: 'warning', icon: 'tabler:alert-triangle', label: 'Degraded' },
  down: { variant: 'danger', icon: 'tabler:circle-x', label: 'Down' },
};

/** "2 min ago", "3 h ago" */
export const timeAgo = (minutes) => (minutes < 60 ? `${minutes} min ago` : `${Math.floor(minutes / 60)} h ago`);