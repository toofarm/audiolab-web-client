import { getTracks, getTrack } from "../tracks";
import { getSession } from "../session";

export const get_tracks = async (): Promise<Track[]> => {
  const token = await getSession();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const tracks = await getTracks(token);
  if (!tracks || tracks.length === 0) {
    throw new Error("No tracks found");
  }

  return tracks;
};

export const get_track = async (id: string): Promise<Track> => {
  const token = await getSession();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const track = await getTrack(token, id);

  if (!track) {
    throw new Error(`Track with id ${id} not found`);
  }

  return track;
};
