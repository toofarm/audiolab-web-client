'use client';

import { FC, useState, useRef } from 'react';
import { createClientTracksService } from '@/lib/services/tracks';
import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';
import Button from '../Button';
import InputText from '../InputText';
import LoadingSpinner from '../LoadingSpinner';

interface TrackUploadProps {
    onUploadSuccess?: () => void;
    className?: string;
}

const TrackUpload: FC<TrackUploadProps> = ({ onUploadSuccess, className = '' }) => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const { startLoading, stopLoading } = useLoading();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Create service instance
    const tracksService = createClientTracksService();

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3', 'audio/flac'];
            if (!validTypes.includes(file.type)) {
                setError('Please select a valid audio file (WAV, MP3, or FLAC)');
                return;
            }

            // Validate file size (max 100MB for tracks)
            if (file.size > 100 * 1024 * 1024) {
                setError('File size must be less than 100MB');
                return;
            }

            setSelectedFile(file);
            setError(null);

            // Auto-generate title if not provided
            if (!title) {
                setTitle(file.name.replace(/\.[^/.]+$/, '')); // Remove extension
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select an audio file');
            return;
        }

        setIsUploading(true);
        setError(null);
        setUploadProgress(0);
        startLoading('Uploading and analyzing track...');

        try {
            // Simulate progress updates
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            // Use the service to create the track
            const result = await tracksService.create(selectedFile);

            clearInterval(progressInterval);
            setUploadProgress(100);

            // Reset form
            setTitle('');
            setArtist('');
            setDescription('');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Call success callback
            if (onUploadSuccess) {
                onUploadSuccess();
            }

            // Navigate to the track page
            if (result.id) {
                router.push(`/tracks/${result.id}`);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload track');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            stopLoading();
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            if (fileInputRef.current) {
                fileInputRef.current.files = files;
                handleFileSelect({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
            }
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <h2 className="text-xl font-bold mb-4">Upload Track</h2>

            <div className="space-y-4">
                {/* File Upload Area */}
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                    />

                    {selectedFile ? (
                        <div className="space-y-2">
                            <div className="text-green-600 font-medium">
                                ✓ {selectedFile.name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                            <Button
                                onClick={() => {
                                    setSelectedFile(null);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                }}
                                className="text-sm"
                                disabled={isUploading}
                            >
                                Change File
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="text-gray-500">
                                Drag and drop an audio file here, or click to browse
                            </div>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                Select Audio File
                            </Button>
                        </div>
                    )}
                </div>

                {/* Track Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputText
                        name="title"
                        label="Track Title"
                        value={title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        placeholder="Enter track title"
                        required
                        disabled={isUploading}
                    />

                    <InputText
                        name="artist"
                        label="Artist (Optional)"
                        value={artist}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArtist(e.target.value)}
                        placeholder="Enter artist name"
                        disabled={isUploading}
                    />
                </div>

                <InputText
                    name="description"
                    label="Description (Optional)"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                    placeholder="Describe your track..."
                    disabled={isUploading}
                />

                {/* Upload Progress */}
                {isUploading && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <LoadingSpinner size="sm" />
                            <span className="text-sm text-gray-600">
                                Uploading track... {uploadProgress}%
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                        {error}
                    </div>
                )}

                {/* Upload Button */}
                <Button
                    onClick={handleUpload}
                    loading={isUploading}
                    disabled={!selectedFile || isUploading}
                    className="w-full"
                >
                    {isUploading ? 'Uploading...' : 'Upload Track'}
                </Button>
            </div>
        </div>
    );
};

export default TrackUpload; 