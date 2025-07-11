'use client';

import { FC } from 'react';
import LoadingSpinner from '../LoadingSpinner';

const Button: FC<{
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void | Promise<void>;
    children?: React.ReactNode;
}> = ({ type, className, disabled, loading, onClick, children }) => {
    return (
        <button
            type={type || 'button'}
            className={`bg-blue-500 text-white font-bold py-2 px-4 
                hover:cursor-pointer hover:opacity-80 rounded flex items-center justify-center gap-2
                ${loading || disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            disabled={disabled || loading}
            onClick={onClick}
        >
            {loading && <LoadingSpinner size="sm" />}
            {children}
        </button>
    );
}

export default Button;