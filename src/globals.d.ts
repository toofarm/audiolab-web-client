interface ImportMeta {
  env: {
    VITE_BASE_URL: string;
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
};
