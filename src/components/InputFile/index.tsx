import { FC } from 'react';

const InputFile: FC<{
    id: string;
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
    required?: boolean;
}> = ({ id, label, accept, required = false }) => {
    return (
        <div className="flex flex-col mb-4">
            <label htmlFor={id} className="text-base font-medium text-secondary-txt mb-2">
                {label}
            </label>
            <input
                type="file"
                id={id}
                name={id}
                accept={accept}
                required={required}
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 
                focus:ring-blue-500"
            />
            <div className='flex text-primary-txt text-xs mt-1 italic'>
                Allowed file types: {accept ? accept.split(',').map(type => type.trim()).join(', ') : 'Any file type'}
            </div>
        </div>
    );
};

export default InputFile;