import { useState } from 'react';
import { Order, OrderProduct, Product } from '@/types/types';


interface UseCreateOrderResult {
  createOrder: (input: Order) => Promise<void>;
  order: Order | null;
  loading: boolean;
  error: string | null;
}

export function useCreateOrder(): UseCreateOrderResult {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (input: Order) => {
    setLoading(true);
    setError(null);

    console.log("test")

    console.log('........................................', JSON.stringify(input));

    console.log(input)
    try {
        const response = await fetch('http://localhost:1005/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create order');
        }
        const createdOrder = await response.json();
        setOrder(createdOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, order, loading, error };
}

