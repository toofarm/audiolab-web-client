'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sample } from '@/lib/services/samples';
// Components
import SampleUpload from '../SampleUpload';
import SampleSelector from '../SampleSelector';
import RemoveSampleButton from '../RemoveSampleButton';
import Button from '../Button';

interface ProjectSamplesProps {
    projectId: number;
    samples: Sample[];
    onSampleAdded?: () => void;
}

const ProjectSamples: FC<ProjectSamplesProps> = ({ projectId, samples, onSampleAdded }) => {
    const [showUpload, setShowUpload] = useState(false);
    const [showSelector, setShowSelector] = useState(false);
    const router = useRouter();

    const handleUploadSuccess = () => {
        setShowUpload(false);
        // Refresh the page data
        router.refresh();
        // Also call the callback if provided
        if (onSampleAdded) {
            onSampleAdded();
        }
    };

    const handleSampleAdded = () => {
        setShowSelector(false);
        // Refresh the page data
        router.refresh();
        // Also call the callback if provided
        if (onSampleAdded) {
            onSampleAdded();
        }
    };

    const handleSampleRemoved = () => {
        // Refresh the page data
        router.refresh();
        // Also call the callback if provided
        if (onSampleAdded) {
            onSampleAdded();
        }
    };

    const existingSampleIds = samples.map(sample => sample.id);

    const formatDuration = (seconds?: number) => {
        if (!seconds) return 'Unknown';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Samples</h3>
                    <p className="text-sm text-gray-600">{samples.length} sample(s) in this project</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setShowSelector(true)}>
                        Add Existing Samples
                    </Button>
                    <Button onClick={() => setShowUpload(true)}>
                        Upload New Sample
                    </Button>
                </div>
            </div>

            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Upload Sample to Project</h2>
                            <Button
                                onClick={() => setShowUpload(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </Button>
                        </div>
                        <SampleUpload
                            onUploadSuccess={handleUploadSuccess}
                            className="border-0 shadow-none p-0"
                        />
                    </div>
                </div>
            )}

            {/* Sample Selector Modal */}
            {showSelector && (
                <SampleSelector
                    projectId={projectId}
                    existingSampleIds={existingSampleIds}
                    onSampleAdded={handleSampleAdded}
                    onClose={() => setShowSelector(false)}
                />
            )}

            {/* Display existing samples */}
            {samples.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {samples.map((sample) => (
                        <div key={sample.id} className="bg-white rounded-lg shadow p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">
                                    <a href={`/samples/${sample.id}`} className="text-blue-500 hover:text-blue-700">
                                        {sample.name}
                                    </a>
                                </h4>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {sample.category}
                                </span>
                            </div>

                            {sample.description && (
                                <p className="text-sm text-gray-600 mb-2">{sample.description}</p>
                            )}

                            <div className="text-xs text-gray-500 space-y-1 mb-3">
                                <div>Duration: {formatDuration(sample.duration_sec)}</div>
                                {sample.tempo_bpm && <div>Tempo: {sample.tempo_bpm} BPM</div>}
                                {sample.key_signature && <div>Key: {sample.key_signature}</div>}
                            </div>

                            <div className="flex justify-end">
                                <RemoveSampleButton
                                    projectId={projectId}
                                    sampleId={sample.id}
                                    onSampleRemoved={handleSampleRemoved}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p>No samples uploaded yet.</p>
                    <p className="text-sm">Click &ldquo;Upload New Sample&rdquo; or &ldquo;Add Existing Samples&rdquo; to get started.</p>
                </div>
            )}
        </div>
    );
};

export default ProjectSamples;