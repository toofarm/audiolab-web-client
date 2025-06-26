import { FC } from 'react';
import { uploadTrack } from '@/app/actions/tracks';

// Components
import HeadingTwo from '@/components/HeadingTwo';
import InputFile from '@/components/InputFile';
import Button from '@/components/Button';

export const UploadPage: FC = () => {
    return (
        <div>
            <HeadingTwo>
                Upload a new track
            </HeadingTwo>
            <form
                action={uploadTrack}
                className="flex flex-col items-start justify-start py-4">
                <InputFile
                    id="track-file"
                    label="Select an audio file"
                    accept=".mp3,.wav"
                    required
                />
                <Button
                    type="submit"
                >
                    Upload Track
                </Button>
            </form>
        </div>
    );
};

export default UploadPage;