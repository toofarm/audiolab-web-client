import { FC } from 'react';
import { get_tracks } from '@/lib/dto/tracks';

// Components
import HeadingTwo from '@/components/HeadingTwo';
import HeadingThree from '@/components/HeadingThree';
import ButtonLink from '@/components/ButtonLink';
import BlueLink from '@/components/BlueLink';

const TracksPage: FC = async () => {
    const tracks = await get_tracks();

    return (
        <div>
            <HeadingTwo>
                Tracks
            </HeadingTwo>
            {tracks && tracks.length > 0 ? (
                <ul className='flex flex-col items-start justify-start p-4 gap-2'>
                    {tracks.map((track) => (
                        <li key={track.id} className="mt-2 flex">
                            <BlueLink href={`/tracks/${track.id}`}>
                                {track.filename}
                            </BlueLink>
                        </li>
                    ))}
                </ul>
            ) : (
                <HeadingThree>
                    No tracks available
                </HeadingThree>
            )}
            <div className='my-4 py-2'>
                <ButtonLink href='/upload'>
                    Upload a new track
                </ButtonLink>
            </div>
        </div>
    );
};

export default TracksPage;