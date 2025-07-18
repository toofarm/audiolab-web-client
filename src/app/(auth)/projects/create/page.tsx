'use client';

import { FC } from 'react';
import ProjectCreate from '@/components/ProjectCreate';

const CreateProjectPage: FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
                <p className="text-gray-600">
                    Set up a new project for AI audio generation
                </p>
            </div>

            <ProjectCreate
                onProjectCreated={(projectId: number) => {
                    // Redirect to the new project page
                    window.location.href = `/projects/${projectId}`;
                }}
            />
        </div>
    );
};

export default CreateProjectPage; 