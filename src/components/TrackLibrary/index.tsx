'use client';

import { FC, useState, useEffect } from 'react';
import { createClientTracksService, Track } from '@/lib/services/tracks';
import { useLoading } from '@/contexts/LoadingContext';
import Button from '../Button';
import LoadingSpinner from '../LoadingSpinner';
import BlueLink from '../BlueLink';
import { formatDuration, formatTempo } from '@/lib/utils';

interface TrackLibraryProps {
    className?: string;
    onTrackSelect?: (track: Track) => void;
    selectable?: boolean;
}

const TrackLibrary: FC<TrackLibraryProps> = ({
    className = '',
    onTrackSelect,
    selectable = false
}) => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { startLoading, stopLoading } = useLoading();

    // Create service instance
    const tracksService = createClientTracksService();

    useEffect(() => {
        loadTracks();
    }, []);

    const loadTracks = async () => {
        try {
            setLoading(true);
            const result = await tracksService.getAll();
            setTracks(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load tracks');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (trackId: string) => {
        if (!confirm('Are you sure you want to delete this track?')) {
            return;
        }

        startLoading('Deleting track...');
        try {
            await tracksService.delete(trackId);
            await loadTracks(); // Reload the list
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete track');
        } finally {
            stopLoading();
        }
    };

    const filteredTracks = tracks.filter(track =>
        track.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && tracks.length === 0) {
        return (
            <div className={`flex items-center justify-center p-8 ${className}`}>
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className={`space-y-6 min-w-full ${className}`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Track Library</h2>
                <div className="text-sm text-gray-600">
                    {tracks.length} tracks total
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search tracks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <BlueLink href="/tracks/upload">
                        <Button>
                            Upload New Track
                        </Button>
                    </BlueLink>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Tracks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTracks.map(track => (
                    <div key={track.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                        {/* Track Header */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg wrap-normal">
                                    {selectable ? (
                                        <button
                                            onClick={() => onTrackSelect?.(track)}
                                            className="text-left hover:text-blue-600 transition-colors"
                                        >
                                            {track.filename}
                                        </button>
                                    ) : (
                                        <BlueLink href={`/tracks/${track.id}`}>
                                            {track.filename}
                                        </BlueLink>
                                    )}
                                </h3>
                            </div>
                            {!selectable && (
                                <Button
                                    onClick={() => handleDelete(track.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Delete
                                </Button>
                            )}
                        </div>

                        {/* Track Info */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Duration:</span>
                                <span>{track.duration_sec !== undefined ? formatDuration(track.duration_sec) : 'N/A'}</span>
                            </div>
                            {track.tempo_bpm !== undefined && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tempo:</span>
                                    <span>{formatTempo(track.tempo_bpm)}</span>
                                </div>
                            )}
                            {track.key_signature && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Key:</span>
                                    <span>{track.key_signature}</span>
                                </div>
                            )}
                            {track.time_signature && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Time Signature:</span>
                                    <span>{track.time_signature}/4</span>
                                </div>
                            )}
                        </div>

                        {/* Perceptual Features */}
                        {(track.energy !== undefined || track.intensity !== undefined || track.complexity !== undefined) && (
                            <div className="border-t pt-3 mt-3">
                                <h4 className="text-xs font-medium text-gray-500 mb-2">Perceptual Features</h4>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    {track.energy !== undefined && (
                                        <div className="text-center">
                                            <div className="text-gray-500">Energy</div>
                                            <div className="font-medium">{(track.energy * 100).toFixed(0)}%</div>
                                        </div>
                                    )}
                                    {track.intensity !== undefined && (
                                        <div className="text-center">
                                            <div className="text-gray-500">Intensity</div>
                                            <div className="font-medium">{(track.intensity * 100).toFixed(0)}%</div>
                                        </div>
                                    )}
                                    {track.complexity !== undefined && (
                                        <div className="text-center">
                                            <div className="text-gray-500">Complexity</div>
                                            <div className="font-medium">{(track.complexity * 100).toFixed(0)}%</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Created Date */}
                        <div className="border-t pt-3 mt-3">
                            <div className="text-xs text-gray-500">
                                Created: {new Date(track.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredTracks.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                        {searchTerm ? 'No tracks found matching your search' : 'No tracks available'}
                    </div>
                    <p className="text-gray-400">
                        {searchTerm
                            ? 'Try adjusting your search terms.'
                            : 'Upload your first track to get started!'
                        }
                    </p>
                    {!searchTerm && (
                        <div className="mt-4">
                            <BlueLink href="/tracks/upload">
                                <Button>
                                    Upload Your First Track
                                </Button>
                            </BlueLink>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TrackLibrary; 