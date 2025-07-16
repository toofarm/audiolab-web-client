'use client';

import { FC } from 'react';

const InputText: FC<{
    name: string;
    label?: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}> = ({ name, label, type = 'text', required = false, placeholder, value, onChange, disabled = false }) => {
    return (
        <div className='flex flex-col gap-2'>
            {label && <label
                htmlFor={name}
                className='block text-sm font-medium text-gray-700'>
                {label}
            </label>}
            <input
                type={type}
                id={name}
                name={name}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className='p-2 border rounded text-primary-txt'
            />
        </div>
    );
};

export default InputText;