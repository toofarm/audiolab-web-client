import { FC, useState, useEffect } from 'react';
import { createClientProjectsService } from '@/lib/services/projects';
import { Sample } from '@/lib/dto/projects';

// Components
import SampleUpload from '../SampleUpload';

interface GenerateAudioProps {
    projectId: number;
}

const GenerateAudio: FC<GenerateAudioProps> = ({ projectId }) => {
    const [samples, setSamples] = useState<Sample[]>([]);
    const [selectedSamples, setSelectedSamples] = useState<Sample[]>([]);
    const [loadingSamples, setLoadingSamples] = useState(false);
    const projectsService = createClientProjectsService();

    useEffect(() => {
        const fetchSamples = async () => {
            setLoadingSamples(true);
            const res = await projectsService.getSamples(projectId);
            setSamples(res.samples as Sample[]);
            setLoadingSamples(false);
        };
        fetchSamples();
    }, [projectId]);

    const handleSampleSelect = (sample: Sample) => {
        setSelectedSamples([...selectedSamples, sample]);
    };

    const handleSampleDeselect = (sample: Sample) => {
        setSelectedSamples(selectedSamples.filter((s) => s.id !== sample.id));
    };

    if (loadingSamples) {
        return <div>Loading samples...</div>;
    }

    if (samples.length === 0) {
        return <div>
            <h2>No samples found</h2>
            <p>Please upload some samples to the project</p>
            <SampleUpload />
        </div>;
    }


    return (<div>
        <div>
            <h2>Select Samples</h2>
            <div>
                {samples.map((sample) => (
                    <div key={sample.id}>
                        <input type="checkbox" checked={selectedSamples.some((s) => s.id === sample.id)} onChange={() => handleSampleSelect(sample)} />
                        <label>{sample.name}</label>
                    </div>
                ))}
            </div>
        </div>
    </div>);
};

export default GenerateAudio;