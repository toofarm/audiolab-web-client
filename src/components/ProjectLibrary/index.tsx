'use client';

import { FC, useState, useEffect } from 'react';
import { createClientProjectsService } from '@/lib/services/projects';
import { Project, ProjectFilter } from '@/lib/dto/projects';
import { useLoading } from '@/contexts/LoadingContext';
import Button from '../Button';
import LoadingSpinner from '../LoadingSpinner';
import BlueLink from '../BlueLink';
import ButtonDanger from '../ButtonDanger';

interface ProjectLibraryProps {
    className?: string;
    onProjectSelect?: (project: Project) => void;
    selectable?: boolean;
}

const ProjectLibrary: FC<ProjectLibraryProps> = ({
    className = '',
    onProjectSelect,
    selectable = false
}) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [perPage] = useState(20);

    // Filters
    const [filters, setFilters] = useState<ProjectFilter>({});
    const [searchTerm, setSearchTerm] = useState('');

    const { startLoading, stopLoading } = useLoading();

    const projectsService = createClientProjectsService();

    useEffect(() => {
        loadProjects();
    }, [page, filters]);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const result = await projectsService.getAll(page, perPage, filters);
            setProjects(result.projects);
            setTotal(result.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (projectId: number) => {
        if (!confirm('Are you sure you want to delete this project? This will also delete all associated samples and generated audio.')) {
            return;
        }

        startLoading('Deleting project...');
        try {
            await projectsService.delete(projectId);
            await loadProjects(); // Reload the list
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete project');
        } finally {
            stopLoading();
        }
    };

    const handleSearch = () => {
        setFilters((prev: ProjectFilter) => ({
            ...prev,
            search: searchTerm.trim() || undefined
        }));
        setPage(1);
    };

    const handleStatusFilter = (isActive: boolean | undefined) => {
        setFilters((prev: ProjectFilter) => ({
            ...prev,
            is_active: isActive
        }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({});
        setSearchTerm('');
        setPage(1);
    };

    if (loading && projects.length === 0) {
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
                <h2 className="text-2xl font-bold">Project Library</h2>
                <div className="text-sm text-gray-600">
                    {total} projects total
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={filters.is_active === undefined ? '' : filters.is_active.toString()}
                            onChange={(e) => handleStatusFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
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

                    {/* Create New Project */}
                    <div>
                        <BlueLink href="/projects/create">
                            <Button className="w-full">
                                Create New Project
                            </Button>
                        </BlueLink>
                    </div>
                </div>

                {/* Active Filters */}
                {(filters.is_active !== undefined || filters.search) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {filters.is_active !== undefined && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                Status: {filters.is_active ? 'Active' : 'Inactive'}
                            </span>
                        )}
                        {filters.search && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                Search: {filters.search}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(project => (
                    <div key={project.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                        {/* Project Header */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg truncate">
                                    {selectable ? (
                                        <button
                                            onClick={() => onProjectSelect?.(project)}
                                            className="text-left hover:text-blue-600 transition-colors"
                                        >
                                            {project.name}
                                        </button>
                                    ) : (
                                        <BlueLink href={`/projects/${project.id}`}>
                                            {project.name}
                                        </BlueLink>
                                    )}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {project.description || 'No description'}
                                </p>
                            </div>
                            {!selectable && (
                                <ButtonDanger
                                    onClick={() => handleDelete(project.id)}
                                >
                                    Delete
                                </ButtonDanger>
                            )}
                        </div>

                        {/* Project Info */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className={`font-medium ${project.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                    {project.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Visibility:</span>
                                <span className="font-medium">
                                    {project.is_public ? 'Public' : 'Private'}
                                </span>
                            </div>
                            {project.genre && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Genre:</span>
                                    <span className="font-medium capitalize">{project.genre}</span>
                                </div>
                            )}
                            {project.mood && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Mood:</span>
                                    <span className="font-medium capitalize">{project.mood}</span>
                                </div>
                            )}
                            {project.tempo_bpm && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tempo:</span>
                                    <span className="font-medium">{project.tempo_bpm} BPM</span>
                                </div>
                            )}
                            {project.key_signature && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Key:</span>
                                    <span className="font-medium">{project.key_signature}</span>
                                </div>
                            )}
                        </div>

                        {/* Created Date */}
                        <div className="border-t pt-3 mt-3">
                            <div className="text-xs text-gray-500">
                                Created: {new Date(project.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {projects.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                        {searchTerm || Object.keys(filters).length > 0 ? 'No projects found matching your criteria' : 'No projects available'}
                    </div>
                    <p className="text-gray-400">
                        {searchTerm || Object.keys(filters).length > 0
                            ? 'Try adjusting your search terms or filters.'
                            : 'Create your first project to get started with AI audio generation!'
                        }
                    </p>
                    {!searchTerm && Object.keys(filters).length === 0 && (
                        <div className="mt-4">
                            <BlueLink href="/projects/create">
                                <Button>
                                    Create Your First Project
                                </Button>
                            </BlueLink>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {total > perPage && (
                <div className="flex justify-center items-center gap-4">
                    <Button
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-gray-600">
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
        </div>
    );
};

export default ProjectLibrary; 