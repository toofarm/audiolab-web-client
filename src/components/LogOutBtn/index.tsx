import { FC } from 'react';
import { logoutAuth } from '@/app/actions/auth';

const LogOutBtn: FC = () => {
    return (
        <button onClick={logoutAuth} className="btn btn-primary">
            Log Out
        </button>
    );
};

export default LogOutBtn;