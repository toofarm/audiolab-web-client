/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { FC, useEffect, useState } from 'react';
import { createClientSamplesService, Sample, SampleAnalysis } from '@/lib/services/samples';
import { useLoading } from '@/contexts/LoadingContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';
import BlueLink from '@/components/BlueLink';
import Breadcrumb from '@/components/Breadcrumb';
import AudioPlayer from '@/components/AudioPlayer';
import ButtonDanger from '@/components/ButtonDanger';

interface SampleDetailPageProps {
    params: Promise<{ id: string }>;
}

const SampleDetailPage: FC<SampleDetailPageProps> = ({ params }) => {
    const [sample, setSample] = useState<Sample | null>(null);
    const [analysis, setAnalysis] = useState<SampleAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAnalysis, setShowAnalysis] = useState(false);

    const { startLoading, stopLoading } = useLoading();

    const samplesService = createClientSamplesService();

    useEffect(() => {
        loadSample();
    }, []);

    const loadSample = async () => {
        try {
            const { id } = await params;
            startLoading('Loading sample...');

            const sampleData = await samplesService.getById(parseInt(id));
            setSample(sampleData);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load sample');
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    const loadAnalysis = async () => {
        if (!sample) return;

        try {
            startLoading('Loading analysis...');
            const analysisData = await samplesService.getAnalysis(sample.id);
            setAnalysis(analysisData);
            setShowAnalysis(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load analysis');
        } finally {
            stopLoading();
        }
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

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !sample) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 text-lg mb-4">
                    {error || 'Sample not found'}
                </div>
                <BlueLink href="/samples">
                    Back to Samples
                </BlueLink>
            </div>
        );
    }

    return (
        <div className="space-y-6 min-w-full">
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Samples", href: "/samples" },
                    { label: sample.name, href: `/samples/${sample.id}` },
                ]}
            />

            {/* Sample Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{sample.name}</h1>
                        <p className="text-gray-600">
                            {sample.description || 'No description provided'}
                        </p>
                    </div>
                    <div className="flex gap-2 flex-col text-right justify-end">
                        <div className="flex gap-2">
                            <Button
                                onClick={loadAnalysis}
                                disabled={showAnalysis}
                            >
                                {showAnalysis ? 'Analysis Loaded' : 'View Analysis'}
                            </Button>
                            <ButtonDanger
                                onClick={() => {
                                    samplesService.delete(sample.id);
                                }}
                            >
                                Delete Sample
                            </ButtonDanger>
                        </div>
                        <BlueLink href="/samples">
                            Back to Samples
                        </BlueLink>
                    </div>
                </div>

                <div className="my-6">
                    <AudioPlayer
                        id={sample.id.toString()}
                        content_type={sample.content_type}
                        file_path='samples'
                    />
                </div>

                {/* Basic Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Category</div>
                        <div className="font-medium capitalize">{sample.category}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Duration</div>
                        <div className="font-medium">{formatDuration(sample.duration_sec)}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Size</div>
                        <div className="font-medium">{formatFileSize(sample.size)}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Sample Rate</div>
                        <div className="font-medium">{sample.sample_rate?.toLocaleString()} Hz</div>
                    </div>
                </div>

                {/* Musical Features */}
                {(sample.tempo_bpm || sample.key_signature || sample.time_signature) && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3">Musical Features</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {sample.tempo_bpm && (
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Tempo</div>
                                    <div className="font-medium">{sample.tempo_bpm.toFixed(1)} BPM</div>
                                </div>
                            )}
                            {sample.key_signature && (
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Key</div>
                                    <div className="font-medium">{sample.key_signature}</div>
                                </div>
                            )}
                            {sample.time_signature && (
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Time Signature</div>
                                    <div className="font-medium">{sample.time_signature}/4</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Perceptual Features */}
                {(sample.energy !== undefined || sample.intensity !== undefined || sample.complexity !== undefined) && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3">Perceptual Features</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {sample.energy !== undefined && (
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Energy</div>
                                    <div className="font-medium">{(sample.energy * 100).toFixed(0)}%</div>
                                </div>
                            )}
                            {sample.intensity !== undefined && (
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Intensity</div>
                                    <div className="font-medium">{(sample.intensity * 100).toFixed(0)}%</div>
                                </div>
                            )}
                            {sample.complexity !== undefined && (
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Complexity</div>
                                    <div className="font-medium">{(sample.complexity * 100).toFixed(0)}%</div>
                                </div>
                            )}
                            {sample.loudness !== undefined && (
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Loudness</div>
                                    <div className="font-medium">{sample.loudness.toFixed(1)} dB</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {sample.tags && sample.tags.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {sample.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI Generated Badge */}
                {sample.is_generated === 1 && (
                    <div className="border-t pt-4">
                        <div className="flex items-center gap-2">
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm">
                                AI Generated
                            </span>
                            {sample.generation_prompt && (
                                <span className="text-sm text-gray-600">
                                    Prompt: {sample.generation_prompt}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Detailed Analysis */}
            {showAnalysis && analysis && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Detailed Analysis</h2>

                    {/* Analysis sections would go here */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Spectral Features</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {typeof analysis.spectral_features.spectral_centroid === 'number' && (
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500">Spectral Centroid</div>
                                        <div className="font-medium">
                                            {analysis.spectral_features.spectral_centroid.toFixed(3)}
                                        </div>
                                    </div>
                                )}
                                {typeof analysis.spectral_features.spectral_rolloff === 'number' && (
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500">Spectral Rolloff</div>
                                        <div className="font-medium">
                                            {analysis.spectral_features.spectral_rolloff.toFixed(3)}
                                        </div>
                                    </div>
                                )}
                                {typeof analysis.spectral_features.zero_crossing_rate === 'number' && (
                                    <div className="text-center">
                                        <div className="text-sm text-gray-500">Zero Crossing Rate</div>
                                        <div className="font-medium">
                                            {analysis.spectral_features.zero_crossing_rate.toFixed(3)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {analysis.rhythmic_features.rhythm_pattern ? (
                            <div>
                                <h3 className="font-semibold mb-2">Rhythmic Features</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(analysis.rhythmic_features.rhythm_pattern as any)?.beat_count && (
                                        <div className="text-center">
                                            <div className="text-sm text-gray-500">Beat Count</div>
                                            <div className="font-medium">
                                                {(analysis.rhythmic_features.rhythm_pattern as any).beat_count}
                                            </div>
                                        </div>
                                    )}
                                    {(analysis.rhythmic_features.rhythm_pattern as any)?.rhythm_regularity && (
                                        <div className="text-center">
                                            <div className="text-sm text-gray-500">Rhythm Regularity</div>
                                            <div className="font-medium">
                                                {((analysis.rhythmic_features.rhythm_pattern as unknown as { rhythm_regularity: number }).rhythm_regularity * 100).toFixed(0)}%
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}

                        {analysis.harmonic_features.harmonic_content ? (
                            <div>
                                <h3 className="font-semibold mb-2">Harmonic Features</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(analysis.harmonic_features.harmonic_content as any)?.harmonic_ratio && (
                                        <div className="text-center">
                                            <div className="text-sm text-gray-500">Harmonic Ratio</div>
                                            <div className="font-medium">
                                                {((analysis.harmonic_features.harmonic_content as any).harmonic_ratio * 100).toFixed(0)}%
                                            </div>
                                        </div>
                                    )}
                                    {(analysis.harmonic_features.harmonic_content as any)?.harmonic_complexity && (
                                        <div className="text-center">
                                            <div className="text-sm text-gray-500">Harmonic Complexity</div>
                                            <div className="font-medium">
                                                {(analysis.harmonic_features.harmonic_content as any).harmonic_complexity.toFixed(3)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SampleDetailPage; 