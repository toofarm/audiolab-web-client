import {
  getTracks,
  getTrack,
  createTrack,
  deleteTrack,
  updateTrack,
} from "../tracks";
import { CLIENT_API_URL } from "../constants";

export interface Track {
  id: string;
  filename: string;
  duration_sec: number;
  tempo_bpm: number;
  key_signature?: string;
  time_signature?: number;
  energy?: number;
  intensity?: number;
  complexity?: number;
  loudness?: number;
  content_type: string;
  file_path?: string;
  size: number;
  sample_rate: number;
  loudness_rms: number;
  estimated_key?: string;
  waveplot_base64?: string;
  spectrogram_base64?: string;
  danceability?: number;
  valence?: number;
  acousticness?: number;
  instrumentalness?: number;
  liveness?: number;
  speechiness?: number;
  key?: string;
  mode?: string;
  created_at: string;
  updated_at: string;
}

export class TracksService {
  private getToken: () => Promise<string>;
  private getServerUrl: () => string;

  constructor(getToken: () => Promise<string>, getServerUrl: () => string) {
    this.getToken = getToken;
    this.getServerUrl = getServerUrl;
  }

  async getAll(): Promise<Track[]> {
    const token = await this.getToken();
    return getTracks(token, this.getServerUrl());
  }

  async getById(id: string): Promise<Track> {
    const token = await this.getToken();
    return getTrack(id, token, this.getServerUrl());
  }

  async create(file: File): Promise<Track> {
    const token = await this.getToken();
    return createTrack(file, token, this.getServerUrl());
  }

  async delete(id: string): Promise<boolean> {
    const token = await this.getToken();
    return deleteTrack(id, token, this.getServerUrl());
  }

  async update(id: string, file: File): Promise<Track> {
    const token = await this.getToken();
    return updateTrack(id, file, token, this.getServerUrl());
  }
}

// Factory functions for different contexts
export const createClientTracksService = (): TracksService => {
  return new TracksService(
    async () => {
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        throw new Error("Failed to get session");
      }
      const data = await response.json();
      return data.token;
    },
    () => CLIENT_API_URL
  );
};

// Note: Server service factory is now in a separate file
// to avoid importing server-only functions in client code
