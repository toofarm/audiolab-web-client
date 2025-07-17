import { getTracks, getTrack } from "../tracks";
import { CLIENT_API_URL } from "../constants";
import { getSession } from "../session";

export const get_tracks = async (): Promise<Track[]> => {
  const token = await getSession();

  if (!token) {
    throw new Error("No session found");
  }

  const tracks = await getTracks(token, CLIENT_API_URL);
  if (!tracks || tracks.length === 0) {
    throw new Error("No tracks found");
  }

  return tracks;
};

export const get_track = async (id: string): Promise<Track> => {
  const token = await getSession();

  if (!token) {
    throw new Error("No session found");
  }

  const track = await getTrack(id, token, CLIENT_API_URL);

  if (!track) {
    throw new Error(`Track with id ${id} not found`);
  }

  return track;
};

export const stream_track = async (id: string): Promise<ReadableStream> => {
  const token = await getSession();

  if (!token) {
    throw new Error("No session found");
  }

  const response = await fetch(`${CLIENT_API_URL}/api/tracks/${id}/stream`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to stream track with id ${id}`);
  }

  return response.body as ReadableStream;
};
