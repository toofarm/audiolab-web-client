'use client';

import { FC, useState, useEffect } from 'react';
import { createClientSamplesService, Sample, SampleFilter, CategoryCount } from '@/lib/services/samples';
import { useLoading } from '@/contexts/LoadingContext';
import Button from '../Button';
import LoadingSpinner from '../LoadingSpinner';
import BlueLink from '../BlueLink';
import ButtonDanger from '../ButtonDanger';

interface SampleLibraryProps {
    className?: string;
    onSampleSelect?: (sample: Sample) => void;
    selectable?: boolean;
}

const SampleLibrary: FC<SampleLibraryProps> = ({
    className = '',
    onSampleSelect,
    selectable = false
}) => {
    const [samples, setSamples] = useState<Sample[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [perPage] = useState(20);

    // Filters
    const [filters, setFilters] = useState<SampleFilter>({});
    const [categories, setCategories] = useState<CategoryCount[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const { startLoading, stopLoading } = useLoading();

    const samplesService = createClientSamplesService();

    useEffect(() => {
        loadSamples();
        loadCategories();
    }, [page, filters]);

    const loadSamples = async () => {
        try {
            setLoading(true);
            const result = await samplesService.getAll(page, perPage, filters);
            setSamples(result.samples);
            setTotal(result.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load samples');
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const result = await samplesService.getCategories();
            setCategories(result.categories);
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const handleDelete = async (sampleId: number) => {
        if (!confirm('Are you sure you want to delete this sample?')) {
            return;
        }

        startLoading('Deleting sample...');
        try {
            await samplesService.delete(sampleId);
            await loadSamples(); // Reload the list
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete sample');
        } finally {
            stopLoading();
        }
    };

    const handleSearch = () => {
        setFilters(prev => ({
            ...prev,
            search: searchTerm.trim() || undefined
        }));
        setPage(1);
    };

    const handleCategoryFilter = (category: string) => {
        setFilters(prev => ({
            ...prev,
            category: prev.category === category ? undefined : category
        }));
        setPage(1);
    };

    const handleTagFilter = (tag: string) => {
        setFilters(prev => ({
            ...prev,
            tags: prev.tags?.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...(prev.tags || []), tag]
        }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({});
        setSearchTerm('');
        setPage(1);
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'N/A';
        const mb = bytes / 1024 / 1024;
        return `${mb.toFixed(1)} MB`;
    };

    if (loading && samples.length === 0) {
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
                <h2 className="text-2xl font-bold">Sample Library</h2>
                <div className="text-sm text-gray-600">
                    {total} samples total
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div>
                        <input
                            type="text"
                            placeholder="Search samples..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <select
                            value={filters.category || ''}
                            onChange={(e) => handleCategoryFilter(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.name} value={cat.name}>
                                    {cat.name} ({cat.count})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters */}
                    <div>
                        <Button
                            onClick={clearFilters}
                            className="w-full"
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>

                {/* Active Filters */}
                {(filters.category || filters.tags?.length) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {filters.category && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                Category: {filters.category}
                            </span>
                        )}
                        {filters.tags?.map(tag => (
                            <span key={tag} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                Tag: {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Samples Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {samples.map(sample => (
                    <div key={sample.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                        {/* Sample Header */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg truncate">
                                    {selectable ? (
                                        <button
                                            onClick={() => onSampleSelect?.(sample)}
                                            className="text-left hover:text-blue-600 transition-colors"
                                        >
                                            {sample.name}
                                        </button>
                                    ) : (
                                        <BlueLink href={`/samples/${sample.id}`}>
                                            {sample.name}
                                        </BlueLink>
                                    )}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {sample.description || 'No description'}
                                </p>
                            </div>
                            {!selectable && (
                                <ButtonDanger
                                    onClick={() => handleDelete(sample.id)}
                                >
                                    Delete
                                </ButtonDanger>
                            )}
                        </div>

                        {/* Sample Info */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Category:</span>
                                <span className="font-medium capitalize">{sample.category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Duration:</span>
                                <span>{formatDuration(sample.duration_sec)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Size:</span>
                                <span>{formatFileSize(sample.size)}</span>
                            </div>
                            {sample.tempo_bpm && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tempo:</span>
                                    <span>{sample.tempo_bpm.toFixed(1)} BPM</span>
                                </div>
                            )}
                            {sample.key_signature && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Key:</span>
                                    <span>{sample.key_signature}</span>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        {sample.tags && sample.tags.length > 0 && (
                            <div className="mt-3">
                                <div className="flex flex-wrap gap-1">
                                    {sample.tags.slice(0, 3).map(tag => (
                                        <span
                                            key={tag}
                                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs cursor-pointer hover:bg-gray-200"
                                            onClick={() => handleTagFilter(tag)}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {sample.tags.length > 3 && (
                                        <span className="text-gray-500 text-xs">
                                            +{sample.tags.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* AI Generated Badge */}
                        {sample.is_generated === 1 && (
                            <div className="mt-3">
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                    AI Generated
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {total > perPage && (
                <div className="flex justify-center items-center gap-4">
                    <Button
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-gray-600">
                        Page {page} of {Math.ceil(total / perPage)}
                    </span>
                    <Button
                        onClick={() => setPage(prev => Math.min(Math.ceil(total / perPage), prev + 1))}
                        disabled={page >= Math.ceil(total / perPage)}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Empty State */}
            {samples.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                        No samples found
                    </div>
                    <p className="text-gray-400">
                        {Object.keys(filters).length > 0
                            ? 'Try adjusting your filters or search terms.'
                            : 'Upload your first sample to get started!'
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default SampleLibrary; 