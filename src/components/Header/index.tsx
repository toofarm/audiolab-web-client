import { FC } from 'react';
import Link from 'next/link';
import { verifyAuth } from '@/lib/dal';

import LogOutBtn from '../LogOutBtn';


const Header: FC = async () => {
    const { isAuthenticated } = await verifyAuth();

    return (
        <header>
            <h1>AudioLab</h1>
            <nav>
                <ul>
                    <li><Link href={'/'}>Home</Link></li>
                </ul>
            </nav>
            {isAuthenticated && (<LogOutBtn />)}
        </header>
    );
}

export default Header;