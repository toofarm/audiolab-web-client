'use client';

import { FC, useState } from 'react';
import { createClientProjectsService } from '@/lib/services/projects';
import { useLoading } from '@/contexts/LoadingContext';
import Button from '../Button';
import InputText from '../InputText';
import LoadingSpinner from '../LoadingSpinner';

interface ProjectCreateProps {
    onProjectCreated?: (projectId: number) => void;
    className?: string;
}

const ProjectCreate: FC<ProjectCreateProps> = ({ onProjectCreated, className = '' }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [mood, setMood] = useState('');
    const [tempoBpm, setTempoBpm] = useState('');
    const [keySignature, setKeySignature] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { startLoading, stopLoading } = useLoading();

    const projectsService = createClientProjectsService();

    const handleCreate = async () => {
        if (!name.trim()) {
            setError('Please provide a project name');
            return;
        }

        setIsCreating(true);
        setError(null);
        startLoading('Creating project...');

        try {
            const projectData = {
                name: name.trim(),
                description: description.trim() || undefined,
                genre: genre.trim() || undefined,
                mood: mood.trim() || undefined,
                tempo_bpm: tempoBpm ? parseFloat(tempoBpm) : undefined,
                key_signature: keySignature.trim() || undefined,
                is_public: isPublic,
            };

            const project = await projectsService.create(projectData);

            // Reset form
            setName('');
            setDescription('');
            setGenre('');
            setMood('');
            setTempoBpm('');
            setKeySignature('');
            setIsPublic(false);

            // Call success callback
            if (onProjectCreated) {
                onProjectCreated(project.id);
            }

            // Show success message
            console.log('Project created successfully:', project);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create project');
        } finally {
            setIsCreating(false);
            stopLoading();
        }
    };

    const keySignatures = [
        'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
        'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm'
    ];

    const genres = [
        'electronic', 'ambient', 'rock', 'pop', 'jazz', 'classical', 'hip-hop', 'country',
        'folk', 'blues', 'reggae', 'punk', 'metal', 'indie', 'experimental', 'soundtrack'
    ];

    const moods = [
        'dark', 'bright', 'mysterious', 'energetic', 'calm', 'melancholic', 'uplifting',
        'aggressive', 'peaceful', 'dramatic', 'playful', 'serious', 'romantic', 'nostalgic'
    ];

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>

            <div className="space-y-4">
                {/* Project Name */}
                <InputText
                    name="name"
                    label="Project Name *"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    placeholder="Enter project name"
                    required
                    disabled={isCreating}
                />

                {/* Project Description */}
                <InputText
                    name="description"
                    label="Description (Optional)"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                    placeholder="Describe your project..."
                    disabled={isCreating}
                />

                {/* Project Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Genre */}
                    <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Genre (Optional)
                        </label>
                        <select
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            className="p-2 border rounded text-primary-txt"
                            disabled={isCreating}
                        >
                            <option value="">Select Genre</option>
                            {genres.map(g => (
                                <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    {/* Mood */}
                    <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Mood (Optional)
                        </label>
                        <select
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            className="p-2 border rounded text-primary-txt"
                            disabled={isCreating}
                        >
                            <option value="">Select Mood</option>
                            {moods.map(m => (
                                <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Musical Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tempo */}
                    <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Target Tempo (BPM) (Optional)
                        </label>
                        <input
                            type="number"
                            min="40"
                            max="200"
                            value={tempoBpm}
                            onChange={(e) => setTempoBpm(e.target.value)}
                            placeholder="120"
                            className="p-2 border rounded text-primary-txt"
                            disabled={isCreating}
                        />
                    </div>

                    {/* Key Signature */}
                    <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Key Signature (Optional)
                        </label>
                        <select
                            value={keySignature}
                            onChange={(e) => setKeySignature(e.target.value)}
                            className="p-2 border rounded text-primary-txt"
                            disabled={isCreating}
                        >
                            <option value="">Select Key</option>
                            {keySignatures.map(key => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Visibility */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        disabled={isCreating}
                        className="rounded"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-700">
                        Make this project public (visible to other users)
                    </label>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                        {error}
                    </div>
                )}

                {/* Create Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleCreate}
                        disabled={isCreating || !name.trim()}
                        className="min-w-[120px]"
                    >
                        {isCreating ? (
                            <div className="flex items-center gap-2">
                                <LoadingSpinner size="sm" />
                                Creating...
                            </div>
                        ) : (
                            'Create Project'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProjectCreate; 