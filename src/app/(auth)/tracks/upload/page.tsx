import { FC, Suspense } from 'react';
import { uploadTrack } from '@/app/actions/tracks';

// Components
import HeadingTwo from '@/components/HeadingTwo';
import InputFile from '@/components/InputFile';
import Button from '@/components/Button';
import FormWithLoading from '@/components/FormWithLoading';
import Loading from '@/app/loading';

export const UploadPage: FC = () => {
    return (
        <div>
            <Suspense fallback={<Loading />}>
                <HeadingTwo>
                    Upload a new track
                </HeadingTwo>
                <FormWithLoading
                    action={uploadTrack}
                    className="flex flex-col items-start justify-start py-4"
                    loadingMessage='Uploading and analyzing your track...'
                >
                    <InputFile
                        id="track-file"
                        label="Select an audio file"
                        accept=".mp3,.wav"
                        required
                    />
                    <Button type="submit">
                        Upload Track
                    </Button>
                </FormWithLoading>
            </Suspense>
        </div>
    );
};

export default UploadPage;