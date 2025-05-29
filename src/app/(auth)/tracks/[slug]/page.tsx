import { get_track } from "@/lib/dto/tracks";
import { formatDuration, formatSampleRate, formatFileSize } from "@/lib/utils";
import { deleteOneTrack } from "@/app/actions/tracks";
import Image from "next/image";

// Components
import HeadingTwo from "@/components/HeadingTwo";
import HeadingThree from "@/components/HeadingThree";
import LabeledItem from "@/components/LabeledItem";
import Breadcrumb from "@/components/Breadcrumb";

const TrackDetailPage = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}) => {
    const { slug } = await params;
    const track = await get_track(slug);

    // console.log("Track details:", track);

    return (
        <div className="flex flex-col items-start justify-start gap-2">
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Tracks", href: "/tracks" },
                    { label: track.filename, href: `/tracks/${track.id}` },
                ]}
            />
            <div className="mt-4">
                <div className="flex items-center justify-between">
                    <HeadingTwo>{track.filename}</HeadingTwo>
                    <nav>
                        <ul className="flex items-center gap-2">
                            <li>
                                <form action={deleteOneTrack}>
                                    <input type="hidden" name="trackId" value={track.id} />
                                    <input type="hidden" name="path" value={`/tracks`} />
                                    <input type="hidden" name="redirect" value={'true'} />
                                    <button
                                        type="submit"
                                        className="text-red-600 text-sm hover:text-red-800 hover:cursor-pointer"
                                    >
                                        Delete Track
                                    </button>
                                </form>
                            </li>
                        </ul>
                    </nav>
                </div>
                <HeadingThree>
                    Track ID: {track.id}
                </HeadingThree>
                <LabeledItem label="File Type" item={track.content_type} />
                <LabeledItem label="Duration" item={formatDuration(track.duration_sec)} />
                <LabeledItem label="File Size" item={formatFileSize(track.size)} />
                <LabeledItem label="Sample Rate" item={formatSampleRate(track.sample_rate)} />
                <LabeledItem label="Tempo (BPM)" item={track.tempo_bpm} />
                <LabeledItem label="Loudness (RMS)" item={track.loudness_rms} />
                <LabeledItem label="Key Signature (Estimated)" item={track.estimated_key || "N/A"} />

                <div className="my-4">
                    <HeadingThree>
                        Waveform
                    </HeadingThree>
                    {track.waveplot_base64 ? (
                        <Image
                            src={`data:image/png;base64,${track.waveplot_base64}`}
                            alt="Waveform"
                            width={800}
                            height={200}
                            className="w-full h-auto mt-4"
                        />
                    ) : (
                        <p className="text-secondary-txt mt-4">No waveform available</p>
                    )}

                    <HeadingThree>
                        Spectrogram
                    </HeadingThree>
                    {track.spectrogram_base64 ? (
                        <Image
                            width={800}
                            height={200}
                            src={`data:image/png;base64,${track.spectrogram_base64}`}
                            alt="Spectrogram"
                            className="w-full h-auto"
                        />
                    ) : (
                        <p className="text-secondary-txt">No spectrogram available</p>
                    )}
                </div>
            </div>
        </div>
    )
};

export default TrackDetailPage;