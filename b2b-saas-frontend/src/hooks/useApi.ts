import { useState, useEffect } from 'react';

interface UseApiOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
}

export const useApi = <T,>(
    apiFunction: () => Promise<T>,
    options?: UseApiOptions<T>
) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const execute = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await apiFunction();
            setData(result);
            options?.onSuccess?.(result);
            return result;
        } catch (err) {
            setError(err);
            options?.onError?.(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, execute };
};
