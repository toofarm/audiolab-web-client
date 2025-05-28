import { FC } from 'react';

const InputText: FC<{
    name: string;
    label?: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
}> = ({ name, label, type = 'text', required = false, placeholder }) => {
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
                className='p-2 border rounded text-primary-txt'
            />
        </div>
    );
};

export default InputText;