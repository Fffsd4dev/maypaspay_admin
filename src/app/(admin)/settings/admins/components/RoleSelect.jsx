import { Form } from 'react-bootstrap';
import { useAuthContext } from '@/context/useAuthContext';

/**
 * A dropdown of roles. The super admin role is only offered to super admins,
 * because only they can hand it out (the API enforces this too).
 */
const RoleSelect = ({ roles, value, onChange, placeholder = 'Select a role', ...props }) => {
  const { admin: me } = useAuthContext();
  const options = roles.filter((role) => me?.is_super_admin || role.name !== 'super_admin');

  return (
    <Form.Select value={value} onChange={(e) => onChange(e.target.value)} {...props}>
      <option value="">{placeholder}</option>
      {options.map((role) => (
        <option key={role.id} value={role.id}>
          {role.label}
        </option>
      ))}
    </Form.Select>
  );
};

export default RoleSelect;
