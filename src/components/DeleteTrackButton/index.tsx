'use client';

import { FC, useState } from 'react';
import { deleteOneTrack } from '@/app/actions/tracks';
import { useLoading } from '@/contexts/LoadingContext';
import Button from '../Button';

interface DeleteTrackButtonProps {
    trackId: string;
    className?: string;
}

const DeleteTrackButton: FC<DeleteTrackButtonProps> = ({ trackId, className = '' }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { startLoading, stopLoading } = useLoading();

    const handleDelete = async () => {
        if (isDeleting) return;

        if (!confirm('Are you sure you want to delete this track?')) {
            return;
        }

        setIsDeleting(true);
        startLoading('Deleting track...');

        try {
            const formData = new FormData();
            formData.append('trackId', trackId);
            formData.append('path', '/tracks');
            formData.append('redirect', 'true');

            await deleteOneTrack(formData);
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