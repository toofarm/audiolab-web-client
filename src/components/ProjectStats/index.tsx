'use client';

import { FC } from 'react';
import { ProjectStats as ProjectStatsType } from '@/lib/dto/projects';
import { GenerationStats } from '@/lib/dto/generated_audio';
import { formatDuration } from '@/lib/utils';

interface ProjectStatsProps {
    stats: ProjectStatsType;
    generationStats: GenerationStats;
    className?: string;
}

const ProjectStats: FC<ProjectStatsProps> = ({ stats, generationStats, className = '' }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <h3 className="text-lg font-bold mb-4">Project Statistics</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Sample Statistics */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">Samples</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Samples:</span>
                            <span className="font-medium">{stats.total_samples}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Duration:</span>
                            <span className="font-medium">{formatDuration(stats.total_duration)}</span>
                        </div>
                        {stats.avg_tempo && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Avg Tempo:</span>
                                <span className="font-medium">{stats.avg_tempo.toFixed(1)} BPM</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Generation Statistics */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">Generated Audio</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Generated:</span>
                            <span className="font-medium">{generationStats.total_generated}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Duration:</span>
                            <span className="font-medium">{formatDuration(generationStats.total_duration)}</span>
                        </div>
                    </div>
                </div>

                {/* Common Genres */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">Common Genres</h4>
                    <div className="space-y-1">
                        {stats.common_genres.length > 0 ? (
                            stats.common_genres.slice(0, 3).map((genre, index) => (
                                <div key={genre} className="text-sm">
                                    <span className="text-gray-600">{index + 1}.</span>
                                    <span className="ml-2 capitalize">{genre}</span>
                                </div>
                            ))
                        ) : (
                            <span className="text-gray-500 text-sm">No genres specified</span>
                        )}
                    </div>
                </div>

                {/* Common Moods */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">Common Moods</h4>
                    <div className="space-y-1">
                        {stats.common_moods.length > 0 ? (
                            stats.common_moods.slice(0, 3).map((mood, index) => (
                                <div key={mood} className="text-sm">
                                    <span className="text-gray-600">{index + 1}.</span>
                                    <span className="ml-2 capitalize">{mood}</span>
                                </div>
                            ))
                        ) : (
                            <span className="text-gray-500 text-sm">No moods specified</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Generation Status Breakdown */}
            {generationStats.total_generated > 0 && (
                <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-700 mb-3">Generation Status</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(generationStats.status_counts).map(([status, count]) => (
                            <div key={status} className="text-center p-3 bg-gray-50 rounded">
                                <div className="text-lg font-bold text-gray-800">{count as number}</div>
                                <div className="text-sm text-gray-600 capitalize">{status}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Model Usage */}
            {Object.keys(generationStats.model_counts).length > 0 && (
                <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-700 mb-3">Model Usage</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(generationStats.model_counts).map(([model, count]) => (
                            <div key={model} className="text-center p-3 bg-blue-50 rounded">
                                <div className="text-lg font-bold text-blue-800">{count as number}</div>
                                <div className="text-sm text-blue-600 capitalize">{model.replace('_', ' ')}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectStats; 