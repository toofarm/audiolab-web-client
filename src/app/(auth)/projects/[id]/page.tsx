import { createServerProjectsService } from "@/lib/services/projects.server";
import { createServerGeneratedAudioService } from "@/lib/services/generated_audio.server";

// Components
import HeadingTwo from "@/components/HeadingTwo";
import HeadingThree from "@/components/HeadingThree";
import LabeledItem from "@/components/LabeledItem";
import Breadcrumb from "@/components/Breadcrumb";
import ProjectStats from "@/components/ProjectStats";
import DeleteProjectButton from "@/components/DeleteProjectButton";
import ProjectSamples from "@/components/ProjectSamples";
import ProjectGeneratedAudio from "@/components/ProjectGeneratedAudio";

const ProjectDetailPage = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params;

    // Create server service instances
    const projectsService = createServerProjectsService();
    const generatedAudioService = createServerGeneratedAudioService();

    const project = await projectsService.getWithSamples(parseInt(id));
    const stats = await projectsService.getStats(parseInt(id));
    const generationStats = await generatedAudioService.getStats(parseInt(id));

    return (
        <div className="flex flex-col items-start justify-start gap-2">
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Projects", href: "/projects" },
                    { label: project.name, href: `/projects/${project.id}` },
                ]}
            />
            <div className="mt-4 w-full">
                <div className="flex items-center justify-between gap-4">
                    <HeadingTwo>{project.name}</HeadingTwo>
                    <nav>
                        <ul className="flex items-center gap-2">
                            <li>
                                <DeleteProjectButton projectId={project.id} />
                            </li>
                        </ul>
                    </nav>
                </div>

                {project.description && (
                    <p className="text-gray-600 mt-2">{project.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    <LabeledItem label="Project ID" item={project.id} />
                    <LabeledItem label="Genre" item={project.genre || "Not specified"} />
                    <LabeledItem label="Mood" item={project.mood || "Not specified"} />
                    <LabeledItem label="Tempo (BPM)" item={project.tempo_bpm || "Not specified"} />
                    <LabeledItem label="Key Signature" item={project.key_signature || "Not specified"} />
                    <LabeledItem label="Status" item={project.is_active ? "Active" : "Inactive"} />
                    <LabeledItem label="Visibility" item={project.is_public ? "Public" : "Private"} />
                    <LabeledItem label="Created" item={new Date(project.created_at).toLocaleDateString()} />
                    <LabeledItem label="Updated" item={new Date(project.updated_at).toLocaleDateString()} />
                </div>

                {/* Project Statistics */}
                <div className="my-8">
                    <ProjectStats stats={stats} generationStats={generationStats} />
                </div>

                {/* Samples Section */}
                <div className="my-8">
                    <HeadingThree>Samples ({project.samples.length})</HeadingThree>
                    <ProjectSamples
                        projectId={project.id}
                        samples={project.samples}
                    />
                </div>

                {/* Generated Audio Section */}
                <div className="my-8">
                    <HeadingThree>Generated Audio ({project.generated_audio.length})</HeadingThree>
                    <ProjectGeneratedAudio
                        projectId={project.id}
                        generatedAudio={project.generated_audio}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage; 