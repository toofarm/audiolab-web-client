'use client';

import { FC } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

const LoadingOverlay: FC = () => {
    const { isLoading, loadingMessage } = useLoading();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="text-gray-700 text-center font-medium">
                        {loadingMessage || 'Loading...'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay; 