import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { getErrorMessage } from '@/api/client';
import { getSafeRedirect } from '@/auth/redirect';
import { useAuthContext } from '@/context/useAuthContext';

const loginSchema = yup.object({
  email: yup.string().trim().email('Please enter a valid email').required('Please enter your email'),
  password: yup.string().required('Please enter your password'),
});

// Messages shown when the admin lands here after being signed out.
// Only these known values are displayed; anything else in the URL is ignored.
const REASON_MESSAGES = {
  expired: 'Your session has expired. Please sign in again.',
  idle: 'You were signed out because of inactivity.',
  'signed-out': 'You have been signed out.',
};

const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthContext();

  const notice = REASON_MESSAGES[searchParams.get('reason')] ?? '';

  const { control, handleSubmit, resetField } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setLoading(true);
    setError('');
    try {
      await login({ email, password, redirectTo: getSafeRedirect(searchParams.get('redirectTo')) });
      navigate('/auth/verify');
    } catch (err) {
      // Use one generic message for wrong email OR wrong password,
      // so the form never reveals which admin emails exist.
      const status = err.response?.status;
      setError(status === 401 || status === 422 ? 'Invalid email or password.' : getErrorMessage(err));
      resetField('password');
    } finally {
      setLoading(false);
    }
  });

  return { control, onSubmit, loading, error, notice };
};

export default useSignIn;
