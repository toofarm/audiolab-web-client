'use client';

import { FC, useState, useEffect } from 'react';
import { Sample } from '@/lib/services/samples';
import { createClientSamplesService } from '@/lib/services/samples';
import { createClientProjectsService } from '@/lib/services/projects';
import Button from '../Button';
import InputText from '../InputText';
import LoadingSpinner from '../LoadingSpinner';

interface SampleSelectorProps {
    projectId: number;
    existingSampleIds: number[];
    onSampleAdded: () => void;
    onClose: () => void;
}

const SampleSelector: FC<SampleSelectorProps> = ({
    projectId,
    existingSampleIds,
    onSampleAdded,
    onClose
}) => {
    const [samples, setSamples] = useState<Sample[]>([]);
    const [filteredSamples, setFilteredSamples] = useState<Sample[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [addingSample, setAddingSample] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const samplesService = createClientSamplesService();
    const projectsService = createClientProjectsService();

    useEffect(() => {
        loadSamples();
    }, []);

    useEffect(() => {
        filterSamples();
    }, [samples, searchTerm, categoryFilter]);

    const loadSamples = async () => {
        try {
            setLoading(true);
            const result = await samplesService.getAll(1, 100); // Load up to 100 samples
            setSamples(result.samples);
        } catch (err) {
            setError('Failed to load samples');
            console.error('Error loading samples:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterSamples = () => {
        let filtered = samples.filter(sample =>
            !existingSampleIds.includes(sample.id) // Exclude samples already in project
        );

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(sample =>
                sample.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (sample.description && sample.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(sample => sample.category === categoryFilter);
        }

        setFilteredSamples(filtered);
    };

    const handleAddSample = async (sampleId: number) => {
        try {
            setAddingSample(sampleId);
            setError(null);
            await projectsService.addSample(projectId, sampleId);
            onSampleAdded();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add sample to project');
        } finally {
            setAddingSample(null);
        }
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return 'Unknown';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'Unknown';
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(1)} MB`;
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-center">
                        <LoadingSpinner size="lg" />
                        <span className="ml-2">Loading samples...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Add Existing Samples to Project</h2>
                    <Button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </Button>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                        <InputText
                            name="search"
                            label="Search samples"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name or description..."
                        />
                    </div>
                    <div className="w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full p-2 border rounded text-primary-txt"
                        >
                            <option value="all">All Categories</option>
                            <option value="musical">Musical</option>
                            <option value="ambient">Ambient</option>
                            <option value="percussion">Percussion</option>
                            <option value="fx">Sound Effects</option>
                            <option value="voice">Voice</option>
                        </select>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Samples Grid */}
                {filteredSamples.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSamples.map((sample) => (
                            <div key={sample.id} className="bg-gray-50 rounded-lg p-4 border">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-sm truncate flex-1">
                                        {sample.name}
                                    </h4>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
                                        {sample.category}
                                    </span>
                                </div>

                                {sample.description && (
                                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                        {sample.description}
                                    </p>
                                )}

                                <div className="text-xs text-gray-500 space-y-1 mb-3">
                                    <div>Duration: {formatDuration(sample.duration_sec)}</div>
                                    <div>Size: {formatFileSize(sample.size)}</div>
                                    {sample.tempo_bpm && <div>Tempo: {sample.tempo_bpm} BPM</div>}
                                    {sample.key_signature && <div>Key: {sample.key_signature}</div>}
                                </div>

                                <Button
                                    onClick={() => handleAddSample(sample.id)}
                                    loading={addingSample === sample.id}
                                    disabled={addingSample !== null}
                                    className="w-full text-sm"
                                >
                                    {addingSample === sample.id ? 'Adding...' : 'Add to Project'}
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        {searchTerm || categoryFilter !== 'all' ? (
                            <>
                                <p>No samples found matching your criteria.</p>
                                <p className="text-sm">Try adjusting your search or filters.</p>
                            </>
                        ) : (
                            <>
                                <p>No samples available to add.</p>
                                <p className="text-sm">All your samples are already in this project or you haven&apos;t uploaded any yet.</p>
                            </>
                        )}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SampleSelector; 