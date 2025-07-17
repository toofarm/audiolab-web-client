'use client';

import { FC } from 'react';
import TrackLibrary from '@/components/TrackLibrary';

const TracksPage: FC = () => {
    return (
        <div className="space-y-8 min-w-full">
            <div>
                <h1 className="text-3xl font-bold mb-2">Tracks</h1>
                <p className="text-gray-600">
                    Manage and listen to your uploaded tracks
                </p>
            </div>

            <TrackLibrary />
        </div>
    );
};

export default TracksPage;