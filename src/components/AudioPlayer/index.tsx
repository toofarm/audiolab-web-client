"use client";

import { FC, useRef, useEffect } from 'react';
import { streamTrack } from '@/app/actions/tracks';


type Props = {
    id: string;
};

const AudioPlayer: FC<Props> = ({ id }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const fetchAudio = async () => {
            try {
                const stream = await streamTrack(id);

                if (audioRef.current && stream) {
                    // Convert ReadableStream to ArrayBuffer
                    const response = new Response(stream);
                    const arrayBuffer = await response.arrayBuffer();
                    const url = URL.createObjectURL(new Blob([arrayBuffer]));
                    audioRef.current.src = url;
                }
            } catch (error) {
                console.error('Error fetching audio:', error);
            }
        };

        fetchAudio();


        // Cleanup function to revoke the object URL when the component unmounts
        return () => {
            if (audioRef.current && audioRef.current.src) {
                URL.revokeObjectURL(audioRef.current.src);
            }
        };
    }, [id]);

    return (
        <div>
            <audio
                ref={audioRef}
                controls
                className="w-full h-12 bg-gray-100 rounded-lg shadow-md"
                style={{ outline: 'none' }}>
                <source />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}

export default AudioPlayer;