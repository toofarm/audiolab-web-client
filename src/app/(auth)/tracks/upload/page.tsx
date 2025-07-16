'use client';

import { FC } from 'react';
import TrackUpload from '@/components/TrackUpload';

const UploadPage: FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Upload Track</h1>
                <p className="text-gray-600">
                    Upload and share your music with the world
                </p>
            </div>

            <TrackUpload />
        </div>
    );
};

export default UploadPage;