'use client';

import { FC, FormEvent, useState } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

interface FormWithLoadingProps {
    action: (formData: FormData) => Promise<void>;
    children: React.ReactNode;
    className?: string;
    loadingMessage?: string;
}

const FormWithLoading: FC<FormWithLoadingProps> = ({
    action,
    children,
    className = '',
    loadingMessage = 'Processing...'
}) => {
    const { startLoading, stopLoading } = useLoading();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        startLoading(loadingMessage);

        try {
            const formData = new FormData(e.currentTarget);
            await action(formData);
        } catch (error) {
            console.error('Form submission error:', error);
            // Error handling is done by the server action
        } finally {
            setIsSubmitting(false);
            stopLoading();
        }
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            {children}
        </form>
    );
};

export default FormWithLoading; 