/**
 * PasswordInput (eye inside the field) for react-hook-form forms, used like TextFormInput:
 *   <PasswordFormInput control={control} name="password" label="Password" autoComplete="current-password" />
 */
import { FormGroup, FormLabel } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import PasswordInput from './PasswordInput';

const PasswordFormInput = ({ name, control, id, label, containerClassName, ...other }) => (
  <Controller
    name={name}
    control={control}
    defaultValue=""
    render={({ field, fieldState }) => (
      <FormGroup className={containerClassName}>
        {label && <FormLabel htmlFor={id ?? name}>{label}</FormLabel>}
        <PasswordInput
          id={id ?? name}
          {...other}
          {...field}
          isInvalid={Boolean(fieldState.error?.message)}
          feedback={fieldState.error?.message}
        />
      </FormGroup>
    )}
  />
);

export default PasswordFormInput;