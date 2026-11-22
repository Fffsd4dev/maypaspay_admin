import { toast } from 'react-toastify';

/**
 * Some changes (like making someone a super admin) need a second admin's approval.
 * The API answers those with 202 Accepted instead of applying them, so we tell the user.
 */
export function notifyResult(response, successMessage) {
  if (response?.status === 202) {
    const message = response.data?.message;
    toast.info(
      typeof message === 'string' && message.length <= 200
        ? message
        : 'Sent for approval. A second admin must approve this before it takes effect.',
    );
    return;
  }
  toast.success(successMessage);
}
