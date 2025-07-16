"use client";

import { FC, useRef, useEffect, useState } from 'react';
import { CLIENT_API_URL } from '@/lib/constants';

type Props = {
    id: string;
    content_type: string;
};

const AudioPlayer: FC<Props> = ({ id, content_type }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        let timeoutId: NodeJS.Timeout;
        let totalBytesRead = 0;
        let contentLength: number | null = null;
        let streamComplete = false;
        let lastChunkTime = Date.now();

        const fetchAudio = async () => {
            try {
                // Get session token from client-side API
                const sessionResponse = await fetch('/api/auth/session');
                if (!sessionResponse.ok) {
                    throw new Error("User is not authenticated");
                }
                const sessionData = await sessionResponse.json();
                const token = sessionData.token;

                if (!token) {
                    throw new Error("No session token found");
                }

                // Make direct fetch request
                const response = await fetch(`${CLIENT_API_URL}/api/tracks/${id}/stream`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to stream track with id ${id}`);
                }

                const stream = response.body;
                if (!isMounted) return;

                if (audioRef.current && stream) {
                    try {
                        // Get content length if available
                        const lengthHeader = response.headers.get('Content-Length');
                        if (lengthHeader) {
                            contentLength = parseInt(lengthHeader, 10);
                        }

                        const reader = stream.getReader();
                        if (!reader) {
                            throw new Error('Could not get stream reader');
                        }

                        const chunks: Uint8Array[] = [];

                        const readChunkWithTimeout = (): Promise<ReadableStreamReadResult<Uint8Array>> => {
                            return new Promise((resolve, reject) => {
                                timeoutId = setTimeout(() => {
                                    const timeSinceLastChunk = Date.now() - lastChunkTime;
                                    reject(new Error(`Chunk read timeout after ${timeSinceLastChunk}ms of inactivity`));
                                }, 30000); // 30 second timeout

                                reader.read()
                                    .then(result => {
                                        clearTimeout(timeoutId);
                                        if (!result.done) {
                                            lastChunkTime = Date.now();
                                        }
                                        resolve(result);
                                    })
                                    .catch(error => {
                                        clearTimeout(timeoutId);
                                        reject(error);
                                    });
                            });
                        };

                        try {
                            while (true) {
                                const result = await readChunkWithTimeout();

                                if (result.done) {
                                    streamComplete = true;
                                    break;
                                }

                                const chunk = result.value;
                                chunks.push(chunk);
                                totalBytesRead += chunk.length;

                                // Update progress if we know the content length
                                if (contentLength) {
                                    const newProgress = (totalBytesRead / contentLength) * 100;
                                    setProgress(newProgress);
                                }

                                // If we've received a substantial amount of data, try to create the blob
                                if (totalBytesRead > 50000 && chunks.length > 0 && !streamComplete) {
                                    try {
                                        const partialBlob = new Blob(chunks, { type: content_type });
                                        const partialUrl = URL.createObjectURL(partialBlob);

                                        if (!isMounted) {
                                            URL.revokeObjectURL(partialUrl);
                                            return;
                                        }

                                        audioRef.current.src = partialUrl;
                                        // Continue reading in the background
                                        continue;
                                    } catch (blobError) {
                                        console.error('Error creating partial blob:', blobError);
                                    }
                                }

                                if (!isMounted) {
                                    reader.cancel();
                                    return;
                                }
                            }

                            // Create final blob with all data
                            const finalBlob = new Blob(chunks, { type: content_type });

                            // Check if we got the complete file
                            if (contentLength && finalBlob.size < contentLength) {
                                setError('File download was incomplete');
                            }

                            const finalUrl = URL.createObjectURL(finalBlob);

                            if (!isMounted) {
                                URL.revokeObjectURL(finalUrl);
                                return;
                            }

                            audioRef.current.src = finalUrl;

                        } catch (readError) {
                            console.error('Error reading stream:', readError);
                            reader.cancel();

                            // If we have some data, try to use it
                            if (chunks.length > 0 && totalBytesRead > 0) {
                                try {
                                    const partialBlob = new Blob(chunks, { type: content_type });
                                    const partialUrl = URL.createObjectURL(partialBlob);

                                    if (!isMounted) {
                                        URL.revokeObjectURL(partialUrl);
                                        return;
                                    }

                                    audioRef.current.src = partialUrl;
                                    setError('Stream was interrupted, but partial audio is available');
                                } catch (blobError) {
                                    console.error('Error creating partial blob after error:', blobError);
                                    setError('Failed to load audio');
                                }
                            } else {
                                setError('Failed to load audio');
                            }
                            return;
                        }

                        audioRef.current.onloadeddata = () => {
                            setProgress(100);
                            setError(null);
                            audioRef.current?.play().catch(e => console.error('Play failed:', e));
                        };

                        const handleError = () => {
                            const audio = audioRef.current;
                            if (audio?.error) {
                                setError(`Audio error: ${audio.error.message}`);
                            }
                        };
                        audioRef.current.onerror = handleError;

                    } catch (conversionError) {
                        console.error('Error converting stream:', conversionError);
                        setError('Failed to process audio stream');
                    }
                }
            } catch (error) {
                console.error('Error in audio playback:', error);
                setError('Failed to fetch audio');
            }
        };

        fetchAudio();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
            if (audioRef.current?.src) {
                URL.revokeObjectURL(audioRef.current.src);
            }
        };
    }, [id, content_type]);

    return (
        <div className="w-full">
            <audio
                ref={audioRef}
                controls
                preload="auto"
                className="w-full h-12 bg-gray-100 rounded-lg shadow-md"
                style={{ outline: 'none' }}>
                Your browser does not support the audio element.
            </audio>
            {progress > 0 && progress < 100 && (
                <div className="w-full h-1 bg-gray-200 mt-2">
                    <div
                        className="h-full bg-blue-500 transition-all duration-200"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
            {error && (
                <div className="text-red-500 text-sm mt-2">
                    {error}
                </div>
            )}
        </div>
    );
}

export default AudioPlayer;