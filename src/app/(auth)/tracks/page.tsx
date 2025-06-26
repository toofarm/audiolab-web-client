import { FC } from 'react';
import { get_tracks } from '@/lib/dto/tracks';
import { deleteOneTrack } from '@/app/actions/tracks';
import { formatDuration, formatTempo } from '@/lib/utils';

// Components
import HeadingTwo from '@/components/HeadingTwo';
import HeadingThree from '@/components/HeadingThree';
import ButtonLink from '@/components/ButtonLink';
import BlueLink from '@/components/BlueLink';

const DeleteTrackButton = ({ trackId }: { trackId: string }) => {
    return (
        <form action={deleteOneTrack}>
            <input type="hidden" name="trackId" value={trackId} />
            <input type="hidden" name="path" value="/tracks" />
            <button
                type="submit"
                className="text-red-600 text-sm hover:text-red-800 
                    hover:cursor-pointer"
            >
                Delete
            </button>
        </form>
    )
};

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
                        <li key={track.id} className="mt-2 flex gap-2">
                            <BlueLink href={`/tracks/${track.id}`}>
                                {track.filename}
                            </BlueLink>
                            {' | '}
                            {formatDuration(track.duration_sec)}
                            {' | '}
                            {formatTempo(track.tempo_bpm)}
                            {' | '}
                            <DeleteTrackButton
                                trackId={track.id} />
                        </li>
                    ))}
                </ul>
            ) : (
                <HeadingThree>
                    No tracks available
                </HeadingThree>
            )}
            <div className='my-4 py-2'>
                <ButtonLink href='/tracks/upload'>
                    Upload a new track
                </ButtonLink>
            </div>
        </div>
    );
};

export default TracksPage;