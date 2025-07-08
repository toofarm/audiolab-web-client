import { FC } from 'react';
import HeadingThree from '@/components/HeadingThree';

type AudioFeaturesProps = {
    track: Track;
};

const AudioFeatures: FC<AudioFeaturesProps> = ({ track }) => {
    const features = [
        {
            name: 'Danceability',
            value: track.danceability,
            description: 'How suitable a track is for dancing',
            color: 'bg-green-500',
        },
        {
            name: 'Energy',
            value: track.energy,
            description: 'A measure of intensity and activity',
            color: 'bg-red-500',
        },
        {
            name: 'Valence',
            value: track.valence,
            description: 'Musical positiveness conveyed by the track',
            color: 'bg-yellow-500',
        },
        {
            name: 'Acousticness',
            value: track.acousticness,
            description: 'Confidence measure of whether the track is acoustic',
            color: 'bg-blue-500',
        },
        {
            name: 'Instrumentalness',
            value: track.instrumentalness,
            description: 'Predicts whether a track contains no vocals',
            color: 'bg-purple-500',
        },
        {
            name: 'Liveness',
            value: track.liveness,
            description: 'Detects the presence of an audience in the recording',
            color: 'bg-pink-500',
        },
        {
            name: 'Speechiness',
            value: track.speechiness,
            description: 'Detects the presence of spoken words in a track (lower values indicate more speech)',
            color: 'bg-indigo-500',
        },
    ];

    const formatValue = (value: number | undefined) => {
        if (value === undefined || value === null) return 'N/A';
        return Math.round(value * 100);
    };

    const formatLoudness = (value: number | undefined) => {
        if (value === undefined || value === null) return 'N/A';
        return `${value.toFixed(1)} dB`;
    };

    return (
        <div className="space-y-6">
            <HeadingThree>Audio Features</HeadingThree>

            {/* Feature bars */}
            <div className="space-y-4">
                {features.map((feature) => (
                    <div key={feature.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="font-medium text-gray-700">{feature.name}</span>
                                <p className="text-sm text-gray-500">{feature.description}</p>
                            </div>
                            <span className="text-sm font-medium text-gray-600">
                                {formatValue(feature.value)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${feature.color} transition-all duration-300`}
                                style={{
                                    width: feature.value !== undefined && feature.value !== null
                                        ? `${feature.value * 100}%`
                                        : '0%'
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>


            {/* Additional metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                    <div className="text-sm text-gray-500">Loudness</div>
                    <div className="font-medium">{formatLoudness(track.loudness)}</div>
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-500">Key</div>
                    <div className="font-medium">{track.key || 'N/A'}</div>
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-500">Mode</div>
                    <div className="font-medium capitalize">{track.mode || 'N/A'}</div>
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-500">Time Signature</div>
                    <div className="font-medium">{track.time_signature ? `${track.time_signature}/4` : 'N/A'}</div>
                </div>
            </div>
        </div>
    );
};

export default AudioFeatures; 