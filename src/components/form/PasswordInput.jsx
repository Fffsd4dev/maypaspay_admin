/**
 * A password box with a show/hide eye inside the field.
 * Accepts the same props as a Bootstrap Form.Control, plus `feedback` (error text shown under it).
 */
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

// `type` is taken out of the props on purpose: the eye button controls it, so a passed-in
// type="password" must never override it.
// eslint-disable-next-line no-unused-vars
const PasswordInput = ({ isInvalid, feedback, className = '', type, ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className="password-field">
        <Form.Control {...props} type={visible ? 'text' : 'password'} isInvalid={isInvalid} className={className} />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          <IconifyIcon icon={visible ? 'tabler:eye-off' : 'tabler:eye'} />
        </button>
      </div>
      {isInvalid && feedback && <div className="invalid-feedback d-block">{feedback}</div>}
    </>
  );
};

export default PasswordInput;