import { FC } from 'react';

const Button: FC<{
    text: string;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}> = ({ text, onClick, className, disabled }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${className}`}
            disabled={disabled}
        >
            {text}
        </button>
    );
}

export default Button;