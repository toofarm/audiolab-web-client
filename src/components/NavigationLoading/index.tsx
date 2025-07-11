'use client';

import { FC, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoadingSpinner from '../LoadingSpinner';

const NavigationLoading: FC = () => {
    const pathname = usePathname();
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        setIsNavigating(true);

        // Hide loading after a short delay to prevent flashing
        const timer = setTimeout(() => {
            setIsNavigating(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [pathname]);

    if (!isNavigating) return null;

    return (
        <div className="fixed top-4 right-4 z-40">
            <div className="bg-white rounded-lg shadow-lg p-3 flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-gray-600">Loading...</span>
            </div>
        </div>
    );
};

export default NavigationLoading; 