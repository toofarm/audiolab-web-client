import { FC } from 'react';
import { logoutAuth } from '@/app/actions/auth';

const LogOutBtn: FC = () => {
    return (
        <button onClick={logoutAuth} className="text-primary-txt text-base">
            Log Out
        </button>
    );
};

export default LogOutBtn;