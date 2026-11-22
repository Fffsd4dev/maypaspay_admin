/**
 * Which actions the signed-in admin may take on another admin.
 *
 * This mirrors the API's rules so we only show buttons that will work.
 * The API still enforces every rule itself — this is for a clean UI, not security.
 */

export const isSuperAdmin = (admin) => Boolean(admin?.is_super_admin || admin?.role?.name === 'super_admin');

/**
 * Each action: what it's called, when it's available, and whether it needs a reason.
 * reason: 'required' | 'optional' | 'none'
 */
export const ADMIN_ACTIONS = {
  changeRole: {
    label: 'Change role',
    icon: 'tabler:user-cog',
    isAvailable: ({ isSelf }) => !isSelf, // API: you cannot change your own role
  },
  resendInvite: {
    label: 'Resend invite',
    icon: 'tabler:mail-forward',
    reason: 'none',
    confirmText: 'A new invite link will be emailed. The old link will stop working.',
    successMessage: 'A new invite has been sent.',
    isAvailable: ({ target }) => target.status === 'invited',
  },
  unlock: {
    label: 'Unlock account',
    icon: 'tabler:lock-open',
    reason: 'none',
    confirmText: 'This clears the lockout caused by too many wrong passwords.',
    successMessage: 'The account has been unlocked.',
    isAvailable: ({ target }) => target.is_locked,
  },
  signOut: {
    label: 'Sign out everywhere',
    icon: 'tabler:logout',
    reason: 'required',
    confirmText: 'This ends every session of this admin. Their password does not change.',
    successMessage: 'All sessions for this admin have been ended.',
    isAvailable: ({ target, isSelf }) => !isSelf && target.status === 'active',
  },
  reactivate: {
    label: 'Reactivate',
    icon: 'tabler:user-check',
    reason: 'optional',
    confirmText: 'This lets the admin sign in again. If they never accepted their invite, they get a new link.',
    successMessage: 'The admin has been reactivated.',
    isAvailable: ({ target }) => target.status === 'suspended',
  },
  suspend: {
    label: 'Suspend',
    icon: 'tabler:user-off',
    danger: true,
    reason: 'required',
    confirmText: 'This blocks the admin and ends all their sessions straight away.',
    successMessage: 'The admin has been suspended.',
    isAvailable: ({ target, isSelf }) => !isSelf && target.status !== 'suspended', // API: you cannot suspend yourself
  },
};

/** Returns the keys of ADMIN_ACTIONS that `me` can use on `target`, in display order. */
export function getAvailableActions(me, target) {
  const isSelf = me?.uuid === target.uuid;

  // API: only a super admin can act on a super admin.
  if (isSuperAdmin(target) && !isSuperAdmin(me)) return [];

  return Object.keys(ADMIN_ACTIONS).filter((key) => ADMIN_ACTIONS[key].isAvailable({ target, isSelf }));
}
