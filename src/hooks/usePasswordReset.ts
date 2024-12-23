import { useState } from 'react';

interface UsePasswordResetProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function usePasswordReset({ onSuccess, onError }: UsePasswordResetProps = {}) {
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (token: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:1001/api/auth/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      setNewPassword('');
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    newPassword,
    setNewPassword,
    resetPassword,
    isLoading,
    error,
  };
}

