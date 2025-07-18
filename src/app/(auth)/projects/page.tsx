'use client';

import { FC } from 'react';
import ProjectLibrary from '@/components/ProjectLibrary';
import ProjectCreate from '@/components/ProjectCreate';

const ProjectsPage: FC = () => {
    return (
        <div className="space-y-8 min-w-full">
            <div>
                <h1 className="text-3xl font-bold mb-2">Projects</h1>
                <p className="text-gray-600">
                    Create and manage your audio projects for AI generation
                </p>
            </div>

            {/* Create Project Section */}
            <ProjectCreate
                onProjectCreated={() => {
                    // Refresh the library when a new project is created
                    window.location.reload();
                }}
            />

            {/* Library Section */}
            <ProjectLibrary />
        </div>
    );
};

export default ProjectsPage; 