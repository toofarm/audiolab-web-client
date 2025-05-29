import { get_track } from "@/lib/dto/tracks";

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

    console.log("Track details:", track);

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
                <HeadingTwo>{track.filename}</HeadingTwo>
                <HeadingThree>
                    Track ID: {track.id}
                </HeadingThree>
                <LabeledItem label="File Type" item={track.content_type} />
                {track.duration && <LabeledItem label="Duration" item={track.duration} />}
                <LabeledItem label="Sample Rate" item={track.sample_rate} />
                <LabeledItem label="Tempo (BPM)" item={track.tempo_bpm} />
                <LabeledItem label="Loudness (RMS)" item={track.loudness_rms} />

                <div className="my-4">
                    <HeadingThree>
                        Spectrogram
                    </HeadingThree>
                    {track.spectrogram_base64 ? (
                        <img
                            src={`data:image/png;base64,${track.spectrogram_base64}`}
                            alt="Spectrogram"
                            className="w-full h-auto"
                        />
                    ) : (
                        <p className="text-secondary-txt">No spectrogram available</p>
                    )}

                    <HeadingThree>
                        Waveform
                    </HeadingThree>
                    {track.waveform_base64 ? (
                        <img
                            src={`data:image/png;base64,${track.waveform_base64}`}
                            alt="Waveform"
                            className="w-full h-auto mt-4"
                        />
                    ) : (
                        <p className="text-secondary-txt mt-4">No waveform available</p>
                    )}
                </div>
            </div>
        </div>
    )
};

export default TrackDetailPage;