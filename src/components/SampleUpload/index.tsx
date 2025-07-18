'use client';

import { FC, useState, useRef } from 'react';
import { createClientSamplesService } from '@/lib/services/samples';
import { useLoading } from '@/contexts/LoadingContext';
import Button from '../Button';
import InputText from '../InputText';
import LoadingSpinner from '../LoadingSpinner';

interface SampleUploadProps {
    onUploadSuccess?: () => void;
    className?: string;
}

const SampleUpload: FC<SampleUploadProps> = ({ onUploadSuccess, className = '' }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'musical' | 'ambient' | 'percussion' | 'fx' | 'voice'>('musical');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const { startLoading, stopLoading } = useLoading();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const samplesService = createClientSamplesService();

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3', 'audio/flac'];
            if (!validTypes.includes(file.type)) {
                setError('Please select a valid audio file (WAV, MP3, or FLAC)');
                return;
            }

            // Validate file size (max 50MB)
            if (file.size > 50 * 1024 * 1024) {
                setError('File size must be less than 50MB');
                return;
            }

            setSelectedFile(file);
            setError(null);

            // Auto-generate name if not provided
            if (!name) {
                setName(file.name.replace(/\.[^/.]+$/, '')); // Remove extension
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !name.trim()) {
            setError('Please select a file and provide a name');
            return;
        }

        setIsUploading(true);
        setError(null);
        setUploadProgress(0);
        startLoading('Analyzing and uploading sample...');

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

            const result = await samplesService.create(selectedFile, name.trim(), description.trim() || undefined, category);

            clearInterval(progressInterval);
            setUploadProgress(100);

            // Reset form
            setName('');
            setDescription('');
            setCategory('musical');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Call success callback
            if (onUploadSuccess) {
                onUploadSuccess();
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload sample');
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
            <h2 className="text-xl font-bold mb-4">Upload Sample</h2>

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

                {/* Sample Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputText
                        name="name"
                        label="Sample Name"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        placeholder="Enter sample name"
                        required
                        disabled={isUploading}
                    />

                    <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as 'musical' | 'ambient' | 'percussion' | 'fx' | 'voice')}
                            className="p-2 border rounded text-primary-txt"
                            disabled={isUploading}
                        >
                            <option value="musical">Musical</option>
                            <option value="ambient">Ambient</option>
                            <option value="percussion">Percussion</option>
                            <option value="fx">Sound Effects</option>
                            <option value="voice">Voice</option>
                        </select>
                    </div>
                </div>

                <InputText
                    name="description"
                    label="Description (Optional)"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                    placeholder="Describe your sample..."
                    disabled={isUploading}
                />

                {/* Upload Progress */}
                {isUploading && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <LoadingSpinner size="sm" />
                            <span className="text-sm text-gray-600">
                                Analyzing sample... {uploadProgress}%
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
                    disabled={!selectedFile || !name.trim() || isUploading}
                    className="w-full"
                >
                    {isUploading ? 'Uploading...' : 'Upload Sample'}
                </Button>
            </div>
        </div>
    );
};

export default SampleUpload; 