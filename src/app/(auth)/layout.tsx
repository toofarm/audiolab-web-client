import { FC } from 'react';

type Props = {
    children: React.ReactNode;
};

export const AuthLayout: FC<Props> = ({ children }) => {
    return (
        <div className="flex flex-col items-start justify-start p-12 min-h-screen bg-gray-100 shadow-md">
            {children}
        </div>
    )
};

export default AuthLayout;