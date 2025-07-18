'use client';

import { FC, useState } from 'react';
import { createClientProjectsService } from '@/lib/services/projects';
import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../LoadingSpinner';

interface DeleteProjectButtonProps {
    projectId: number;
    className?: string;
    onDelete?: () => void;
}

const DeleteProjectButton: FC<DeleteProjectButtonProps> = ({ projectId, className = '', onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { startLoading, stopLoading } = useLoading();
    const router = useRouter();
    const projectsService = createClientProjectsService();

    const handleDelete = async () => {
        if (isDeleting) return;

        if (!confirm('Are you sure you want to delete this project? This will also delete all associated samples and generated audio.')) {
            return;
        }

        setIsDeleting(true);
        startLoading('Deleting project...');

        try {
            await projectsService.delete(projectId);

            // Call the onDelete callback if provided
            if (onDelete) {
                onDelete();
            } else {
                // Default behavior: redirect to projects page
                router.push('/projects');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
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

export default DeleteProjectButton; 