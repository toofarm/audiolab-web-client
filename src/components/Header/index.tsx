'use client';

import { FC, useState, useEffect } from 'react';
import { createClientAuthService } from '@/lib/services/auth';

// Components
import LogOutBtn from '../LogOutBtn';
import BlueLink from '../BlueLink';
import Image from 'next/image';


const Header: FC = () => {
    const authService = createClientAuthService();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticated = await authService.isAuthenticated();
            setIsAuthenticated(isAuthenticated);
        };

        checkAuth();
    }, []);

    return (
        <header className='p-4 bg-white flex flex-row justify-between items-center 
            shadow-md w-full'>
            <a href={'/'}>
                <h1 className='text-primary-txt font-bold '>AudioLab</h1>
            </a>
            {isAuthenticated && (<nav>
                <ul className='flex flex-row gap-4'>
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
                        <BlueLink href={'/projects'}>
                            Projects
                        </BlueLink>
                    </li>
                    <li>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className='flex flex-row items-center gap-2 cursor-pointer'
                            aria-label='User Menu'
                        >
                            <Image
                                src="/globe.svg"
                                alt="User"
                                className="w-6 h-6"
                                width={24}
                                height={24}
                            />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute top-10 right-0 bg-white shadow-md p-4">
                                <LogOutBtn />
                            </div>
                        )}
                    </li>
                </ul>
            </nav>)}
        </header>
    );
}

export default Header;