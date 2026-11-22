/**
 * The "Actions" menu for one admin, plus the dialogs it opens.
 * Used on both the list page and the details page.
 */
import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import {
  reactivateAdmin,
  resendInvite,
  signOutAdminEverywhere,
  suspendAdmin,
  unlockAdmin,
} from '@/api/admins';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useAuthContext } from '@/context/useAuthContext';
import { ADMIN_ACTIONS, getAvailableActions } from '../adminRules';
import { notifyResult } from '@/utils/notifyResult';
import ChangeRoleModal from './ChangeRoleModal';
import ReasonModal from '@/components/ReasonModal';

// Which API call each action makes (changeRole has its own dialog).
const ACTION_API = {
  resendInvite,
  unlock: unlockAdmin,
  signOut: signOutAdminEverywhere,
  reactivate: reactivateAdmin,
  suspend: suspendAdmin,
};

const AdminActionsMenu = ({ admin, roles, onDone, buttonLabel = 'Actions' }) => {
  const { admin: me } = useAuthContext();
  const [openAction, setOpenAction] = useState(null); // key of ADMIN_ACTIONS, or null

  const available = getAvailableActions(me, admin);
  if (available.length === 0) return null;

  const current = openAction ? ADMIN_ACTIONS[openAction] : null;
  const close = () => setOpenAction(null);

  const runAction = async (body) => {
    const response = await ACTION_API[openAction](admin.uuid, body);
    notifyResult(response, current.successMessage);
    onDone();
  };

  return (
    <>
      <Dropdown align="end">
        <Dropdown.Toggle variant="light" size="sm">
          {buttonLabel}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {available.map((key) => {
            const action = ADMIN_ACTIONS[key];
            return (
              <Dropdown.Item key={key} onClick={() => setOpenAction(key)} className={action.danger ? 'text-danger' : ''}>
                <IconifyIcon icon={action.icon} className="me-1 align-middle" /> {action.label}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>

      <ChangeRoleModal
        show={openAction === 'changeRole'}
        admin={admin}
        roles={roles}
        onClose={close}
        onDone={onDone}
      />

      {current && openAction !== 'changeRole' && (
        <ReasonModal
          show
          title={current.label}
          adminName={admin.name}
          confirmText={current.confirmText}
          reason={current.reason}
          danger={current.danger}
          onConfirm={runAction}
          onClose={close}
        />
      )}
    </>
  );
};

export default AdminActionsMenu;
