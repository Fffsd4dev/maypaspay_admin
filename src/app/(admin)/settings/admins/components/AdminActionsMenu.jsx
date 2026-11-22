/**
 * The "Actions" menu for one admin, plus the dialogs it opens.
 * Used on both the list page and the details page.
 */
import { useState } from 'react';
import { createPortal } from 'react-dom';
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

// Always position the menu from the top-left. (When it flips upward, the default measures from the
// bottom of the page, which puts it in the wrong place once the menu is drawn at the top level.)
const MENU_POSITIONING = {
  modifiers: [{ name: 'computeStyles', options: { adaptive: false } }],
};

const AdminActionsMenu = ({ admin, roles, onDone }) => {
  const { admin: me } = useAuthContext();
  const [openAction, setOpenAction] = useState(null); // key of ADMIN_ACTIONS, or null

  const available = getAvailableActions(me, admin);
  if (available.length === 0) return null;

  const current = openAction ? ADMIN_ACTIONS[openAction] : null;
  const close = () => setOpenAction(null);

  // Everyday actions first; dangerous ones (Suspend) below a divider so they're harder to hit by mistake.
  const safeActions = available.filter((key) => !ADMIN_ACTIONS[key].danger);
  const dangerActions = available.filter((key) => ADMIN_ACTIONS[key].danger);

  const runAction = async (body) => {
    const response = await ACTION_API[openAction](admin.uuid, body);
    notifyResult(response, current.successMessage);
    onDone();
  };

  const renderItem = (key) => {
    const action = ADMIN_ACTIONS[key];
    return (
      <Dropdown.Item key={key} onClick={() => setOpenAction(key)} className={action.danger ? 'is-danger' : ''}>
        <IconifyIcon icon={action.icon} className="fs-16" /> {action.label}
      </Dropdown.Item>
    );
  };

  return (
    <>
      <Dropdown align="end">
        <Dropdown.Toggle as="button" type="button" className="btn btn-kebab" aria-label={`Actions for ${admin.name}`}>
          <IconifyIcon icon="tabler:dots" />
        </Dropdown.Toggle>
                {/* The menu is drawn at the top level of the page (a portal), not inside the table.
            Tables sit in a scroll box that would cut the menu off and make the table scroll;
            from the top level it floats above everything and opens upward when there's no room below. */}
          {createPortal(
            <Dropdown.Menu className="actions-menu" popperConfig={MENU_POSITIONING}>
              {safeActions.map(renderItem)}
              {safeActions.length > 0 && dangerActions.length > 0 && <Dropdown.Divider />}
              {dangerActions.map(renderItem)}
            </Dropdown.Menu>,
            document.body,
          )}
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
          subject={admin.name}
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