'use client';

import { FC, useState } from 'react';
import { deleteTrack } from '@/lib/tracks';
import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';
import Button from '../Button';

interface DeleteTrackButtonProps {
    trackId: string;
    className?: string;
    onDelete?: () => void;
}

const DeleteTrackButton: FC<DeleteTrackButtonProps> = ({ trackId, className = '', onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { startLoading, stopLoading } = useLoading();
    const router = useRouter();

    const handleDelete = async () => {
        if (isDeleting) return;

        if (!confirm('Are you sure you want to delete this track?')) {
            return;
        }

        setIsDeleting(true);
        startLoading('Deleting track...');

        try {
            await deleteTrack(trackId);

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
        <Button
            onClick={handleDelete}
            loading={isDeleting}
            disabled={isDeleting}
            className={`text-red-600 text-sm hover:text-red-800 hover:cursor-pointer ${className}`}
        >
            {isDeleting ? 'Deleting...' : 'Delete Track'}
        </Button>
    );
};

export default DeleteTrackButton; 