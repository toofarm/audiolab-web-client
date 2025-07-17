'use client';

import { FC } from 'react';
import SampleUpload from '@/components/SampleUpload';
import SampleLibrary from '@/components/SampleLibrary';

const SamplesPage: FC = () => {
    return (
        <div className="space-y-8 min-w-full">
            <div>
                <h1 className="text-3xl font-bold mb-2">Sample Management</h1>
                <p className="text-gray-600">
                    Upload and manage your audio samples for AI generation
                </p>
            </div>

            {/* Upload Section */}
            <SampleUpload
                onUploadSuccess={() => {
                    // Refresh the library when a new sample is uploaded
                    window.location.reload();
                }}
            />

            {/* Library Section */}
            <SampleLibrary />
        </div>
    );
};

export default SamplesPage; 