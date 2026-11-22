import { Dropdown, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useAuthContext } from '@/context/useAuthContext';
import { getInitials } from '@/utils/format';

/** First letters of the admin's name, used as an avatar (e.g. "Ayo Oluwatobi" -> "AO"). */
// const getInitials = (name = '') =>
//   name
//     .split(' ')
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((part) => part[0].toUpperCase())
//     .join('');

const ProfileDropdown = () => {
  const { admin } = useAuthContext();

  return (
    <div className="topbar-item nav-user">
      <Dropdown>
        <DropdownToggle as={'a'} className="topbar-link drop-arrow-none px-2" role="button">
          <span
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-semibold me-lg-2"
            style={{ width: 32, height: 32, fontSize: 13 }}
          >
            {getInitials(admin?.name)}
          </span>
          <span className="d-lg-flex flex-column gap-1 d-none">
            <h5 className="my-0">{admin?.name}</h5>
            <h6 className="my-0 fw-normal">{admin?.role?.label}</h6>
          </span>
          <IconifyIcon icon="tabler:chevron-down" className="d-none d-lg-block align-middle ms-2" />
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-end">
          <DropdownHeader className="noti-title">
            <h6 className="text-overflow m-0">Welcome, {admin?.name?.split(' ')[0]}</h6>
          </DropdownHeader>
                    <DropdownItem as={Link} to="/account">
            <IconifyIcon icon="tabler:user-circle" className="me-1 fs-17 align-middle" />
            <span className="align-middle">My account</span>
          </DropdownItem>
          <DropdownItem as={Link} to="/settings/change-password">
            <IconifyIcon icon="tabler:key" className="me-1 fs-17 align-middle" />
            <span className="align-middle">Change password</span>
          </DropdownItem>
          <div className="dropdown-divider" />
          <DropdownItem as={Link} to="/auth/logout" className="fw-semibold text-danger">
            <IconifyIcon icon="tabler:logout" className="me-1 fs-17 align-middle" />
            <span className="align-middle">Sign out</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ProfileDropdown;
