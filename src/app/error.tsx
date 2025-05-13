import { FC } from 'react';

const Error: FC = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-red-500 text-2xl">Something went wrong!</div>
        </div>
    );
}

export default Error;