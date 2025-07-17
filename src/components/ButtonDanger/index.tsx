'use client';

import { FC } from 'react';
import LoadingSpinner from '../LoadingSpinner';

const ButtonDanger: FC<{
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void | Promise<void>;
    children?: React.ReactNode;
}> = ({ type, className, disabled, loading, onClick, children }) => {
    return <button
        type={type || 'button'}
        className={`border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 px-4 
            hover:cursor-pointer rounded flex items-center justify-center gap-2
            ${loading || disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        disabled={disabled || loading}
        onClick={onClick}
    >
        {loading && <LoadingSpinner size="sm" />}
        {children}
    </button>;
};

export default ButtonDanger;