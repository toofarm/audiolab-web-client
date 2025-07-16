import { FC } from 'react';
import { verifyAuth } from '@/lib/dal';

// Components
import LogOutBtn from '../LogOutBtn';
import BlueLink from '../BlueLink';


const Header: FC = async () => {
    const { isAuthenticated } = await verifyAuth();

    return (
        <header className='p-4 bg-white flex flex-row justify-between items-center 
            shadow-md w-full'>
            <a href={'/'}>
                <h1 className='text-primary-txt font-bold '>AudioLab</h1>
            </a>
            {isAuthenticated && (<nav>
                <ul className='flex flex-row gap-4'>
                    <li>
                        <BlueLink href={'/dashboard'}>
                            Dashboard
                        </BlueLink>
                    </li>
                    <li>
                        <BlueLink href={'/tracks'}>
                            Tracks
                        </BlueLink>
                    </li>
                    <li>
                        <BlueLink href={'/samples'}>
                            Samples
                        </BlueLink>
                    </li>
                    <li>
                        <LogOutBtn />
                    </li>
                </ul>
            </nav>)}
        </header>
    );
}

export default Header;