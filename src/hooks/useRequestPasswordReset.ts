import { useState } from 'react';

interface UseRequestPasswordResetProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useRequestPasswordReset({ onSuccess, onError }: UseRequestPasswordResetProps = {}) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPasswordReset = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:1001/api/auth/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to request password reset');
      }

      setEmail('');
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
    email,
    setEmail,
    requestPasswordReset,
    isLoading,
    error,
  };
}

