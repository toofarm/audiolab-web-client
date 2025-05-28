import { FC } from 'react';

const Button: FC<{
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode;
}> = ({ type, className, disabled, children }) => {
    return (
        <button
            type={type || 'button'}
            className={`bg-blue-500 text-white font-bold py-2 px-4 
                hover:cursor-pointer hover:opacity-80 rounded ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default Button;