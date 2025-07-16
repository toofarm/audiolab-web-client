interface ImportMeta {
  env: {
    VITE_BASE_URL: string;
    VITE_CLIENT_DOMAIN: string;
    VITE_SERVER_URL: string;
  };
}

/////////////////
// AUTH TYPES
/////////////////

type RegisterUser = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

type LoginUser = {
  username: string;
  password: string;
};

type AuthUser = {
  id: string;
  email: string;
  name: string;
  image: string;
};

/////////////////
// TRACKS TYPES
/////////////////

type Track = {
  id: string;
  filename: string;
  estimated_key?: string;
  duration_sec: number;
  sample_rate: number;
  tempo_bpm: number;
  loudness_rms: number;
  spectrogram_base64?: string;
  waveplot_base64?: string;
  content_type: string;
  size: number;
  file_path?: string;
  danceability?: number;
  energy?: number;
  valence?: number;
  acousticness?: number;
  instrumentalness?: number;
  liveness?: number;
  speechiness?: number;
  loudness?: number;
  key?: string;
  mode?: string;
  time_signature?: number;
};

/////////////////
// SAMPLES TYPES
/////////////////

type HarmonicContent = {
  chroma_profile: number[];
  harmonic_complexity: number;
  harmonic_ratio: number;
};

type RhythmPattern = {
  avg_interval: number;
  beat_count: number;
  interval_std: number;
  rhythm_regularity: number;
};

type Sample = {
  category: string;
  channels: number;
  complexity: number;
  content_type: string;
  created_at: string;
  description: string;
  duration_sec: number;
  energy: number;
  file_path: string;
  filename: string;
  generation_prompt: string | null;
  genre: string;
  harmonic_content: HarmonicContent;
  id: number;
  intensity: number;
  is_generated: 1 | 0;
  key_signature: string;
  loudness: number;
  mfcc_features: number[][];
  mood: string;
  name: string;
  size: number;
  sample_rate: number;
  source_samples: string[] | null;
  spectral_centroid: number;
  spectral_rolloff: number;
  tags: string[];
  tempo_bpm: number;
  updated_at: string;
  user_id: number;
  zero_crossing_rate: number;
};
