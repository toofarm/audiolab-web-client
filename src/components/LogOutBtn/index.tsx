import { FC } from 'react';
import { logoutAuth } from '@/app/actions/auth';

const LogOutBtn: FC = () => {
    return (
        <button onClick={logoutAuth} className="text-primary-txt text-base 
            hover:cursor-pointer hover:opacity-80 transition-opacity duration-300">
            Log Out
        </button>
    );
};

export default LogOutBtn;