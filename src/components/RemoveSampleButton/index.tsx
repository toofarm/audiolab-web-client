'use client';

import { FC, useState } from 'react';
import { createClientProjectsService } from '@/lib/services/projects';
import Button from '../Button';

interface RemoveSampleButtonProps {
    projectId: number;
    sampleId: number;
    onSampleRemoved: () => void;
}

const RemoveSampleButton: FC<RemoveSampleButtonProps> = ({
    projectId,
    sampleId,
    onSampleRemoved
}) => {
    const [isRemoving, setIsRemoving] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const projectsService = createClientProjectsService();

    const handleRemove = async () => {
        try {
            setIsRemoving(true);
            setError(null);
            await projectsService.removeSample(projectId, sampleId);
            onSampleRemoved();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove sample from project');
        } finally {
            setIsRemoving(false);
            setShowConfirm(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="flex gap-2">
                <Button
                    onClick={handleRemove}
                    loading={isRemoving}
                    disabled={isRemoving}
                    className="bg-red-500 hover:bg-red-600 text-sm"
                >
                    {isRemoving ? 'Removing...' : 'Confirm Remove'}
                </Button>
                <Button
                    onClick={() => setShowConfirm(false)}
                    disabled={isRemoving}
                    className="bg-gray-500 hover:bg-gray-600 text-sm"
                >
                    Cancel
                </Button>
            </div>
        );
    }

    return (
        <div>
            <Button
                onClick={() => setShowConfirm(true)}
                disabled={isRemoving}
                className="bg-red-500 hover:bg-red-600 text-sm"
            >
                Remove
            </Button>
            {error && (
                <div className="text-red-600 text-xs mt-1">
                    {error}
                </div>
            )}
        </div>
    );
};

export default RemoveSampleButton; 