import { FC } from 'react';
import { get_user } from '@/lib/dto/user';
import { get_tracks } from '@/lib/dto/tracks';

// Components
import HeadingTwo from '@/components/HeadingTwo';
import HeadingThree from '@/components/HeadingThree';
import HeadingFour from '@/components/HeadingFour';
import ButtonLink from '@/components/ButtonLink';
import BlueLink from '@/components/BlueLink';

const DashboardPage: FC = async () => {
    const user = await get_user();
    const tracks = await get_tracks();

    return (
        <div>
            <div className=' border-b border-gray-300 w-full pb-4'>
                <HeadingTwo>
                    {`Dashboard`}
                </HeadingTwo>
                <HeadingThree>
                    {user ? `Welcome, ${user.first_name}!` : 'Please log in.'}
                </HeadingThree>
                <p className='text-secondary-txt'>
                    This is your personal dashboard where you can manage your tracks and account settings.
                </p>
            </div>
            <HeadingFour>
                Tracks
            </HeadingFour>
            {tracks && tracks.length > 0 ? (
                <ul>
                    {tracks.map((track) => (
                        <li key={track.id} className="mt-2">
                            <BlueLink href={`/tracks/${track.id}`}>
                                {track.filename}
                            </BlueLink>
                            <p className="text-sm text-gray-600">{track.duration}</p>
                        </li>
                    ))}
                </ul>) : <HeadingFour>
                No tracks available
            </HeadingFour>}
            <div className='my-4 py-2'>
                <ButtonLink href='/tracks/upload'>
                    Upload a new track
                </ButtonLink>
            </div>
        </div>
    );
}


export default DashboardPage;