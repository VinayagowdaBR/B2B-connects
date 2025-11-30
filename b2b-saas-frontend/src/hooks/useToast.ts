import { useState } from 'react';

interface Toast {
    message: string;
    type: 'success' | 'error' | 'info';
}

export const useToast = () => {
    const [toast, setToast] = useState<Toast | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    return { toast, showToast };
};
