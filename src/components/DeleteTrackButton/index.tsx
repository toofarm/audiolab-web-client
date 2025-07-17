'use client';

import { FC, useState } from 'react';
import { createClientTracksService } from '@/lib/services/tracks';
import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../LoadingSpinner';

interface DeleteTrackButtonProps {
    trackId: string;
    className?: string;
    onDelete?: () => void;
}

const DeleteTrackButton: FC<DeleteTrackButtonProps> = ({ trackId, className = '', onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { startLoading, stopLoading } = useLoading();
    const router = useRouter();
    const tracksService = createClientTracksService();

    const handleDelete = async () => {
        if (isDeleting) return;

        if (!confirm('Are you sure you want to delete this track?')) {
            return;
        }

        setIsDeleting(true);
        startLoading('Deleting track...');

        try {
            await tracksService.delete(trackId);

            // Call the onDelete callback if provided
            if (onDelete) {
                onDelete();
            } else {
                // Default behavior: redirect to tracks page
                router.push('/tracks');
            }
        } catch (error) {
            console.error('Error deleting track:', error);
            stopLoading();
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 px-4 
                hover:cursor-pointer rounded flex items-center justify-center gap-2
                ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {isDeleting ? <LoadingSpinner size="sm" /> : 'Delete'}
        </button>
    );
};

export default DeleteTrackButton; 