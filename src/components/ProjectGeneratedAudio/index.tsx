import { FC } from 'react';
import { GeneratedAudio } from '@/lib/dto/generated_audio';

interface ProjectGeneratedAudioProps {
    projectId: number;
    generatedAudio: GeneratedAudio[];
}

const ProjectGeneratedAudio: FC<ProjectGeneratedAudioProps> = ({ generatedAudio }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Generated Audio</h3>
                    <p className="text-sm text-gray-600">{generatedAudio.length} generated audio file(s)</p>
                </div>
            </div>

            {generatedAudio.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedAudio.map((audio) => (
                        <div key={audio.id} className="bg-white rounded-lg shadow p-4">
                            <h4 className="font-medium">{audio.name}</h4>
                            <p className="text-sm text-gray-600">Generated on {new Date(audio.created_at).toLocaleDateString()}</p>
                            {audio.description && (
                                <p className="text-sm text-gray-500 mt-1">{audio.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <p>No generated audio files yet.</p>
                    <p className="text-sm">Generated audio will appear here when available.</p>
                </div>
            )}
        </div>
    );
};

export default ProjectGeneratedAudio;