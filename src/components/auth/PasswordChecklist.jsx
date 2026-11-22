/** Ticks off each password rule as the person types. */
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { PASSWORD_RULES } from '@/auth/passwordPolicy';

const PasswordChecklist = ({ password }) => (
  <ul className="list-unstyled fs-13 mb-0 mt-2" aria-live="polite">
    {PASSWORD_RULES.map((rule) => {
      const met = rule.test(password);
      return (
        <li key={rule.id} className={`d-flex align-items-center gap-1 ${met ? 'text-success' : 'text-muted'}`}>
          <IconifyIcon icon={met ? 'tabler:circle-check' : 'tabler:circle'} />
          <span>{rule.label}</span>
          <span className="visually-hidden">{met ? '(done)' : '(not yet)'}</span>
        </li>
      );
    })}
  </ul>
);

export default PasswordChecklist;