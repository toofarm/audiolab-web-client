export interface Project {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  genre?: string;
  mood?: string;
  tempo_bpm?: number;
  key_signature?: string;
  generation_model?: string;
  generation_settings?: Record<string, unknown>;
  is_active: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectList {
  projects: Project[];
  total: number;
  page: number;
  per_page: number;
}

export interface ProjectWithSamples extends Project {
  samples: Sample[];
  generated_audio: GeneratedAudio[];
}

export interface ProjectStats {
  total_samples: number;
  total_generated: number;
  total_duration: number;
  avg_tempo?: number;
  common_genres: string[];
  common_moods: string[];
}

export interface ProjectFilter {
  is_active?: boolean;
  genre?: string;
  mood?: string;
  search?: string;
}

// Import types from other DTOs
export interface Sample {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  category: "musical" | "ambient" | "percussion" | "fx" | "voice";
  filename: string;
  file_path: string;
  content_type: string;
  size?: number;
  duration_sec?: number;
  sample_rate?: number;
  channels: number;
  tempo_bpm?: number;
  key_signature?: string;
  time_signature?: number;
  spectral_centroid?: number;
  spectral_rolloff?: number;
  zero_crossing_rate?: number;
  mfcc_features?: number[][];
  rhythm_pattern?: Record<string, unknown>;
  harmonic_content?: Record<string, unknown>;
  loudness?: number;
  energy?: number;
  complexity?: number;
  intensity?: number;
  tags?: string[];
  mood?: string;
  genre?: string;
  is_generated: number;
  source_samples?: number[];
  generation_prompt?: string;
  project_id?: number;
  created_at: string;
  updated_at: string;
}

export interface GeneratedAudio {
  id: number;
  user_id: number;
  project_id: number;
  name: string;
  description?: string;
  filename: string;
  file_path: string;
  content_type: string;
  size?: number;
  duration_sec?: number;
  sample_rate?: number;
  channels: number;
  tempo_bpm?: number;
  key_signature?: string;
  time_signature?: number;
  generation_model: string;
  generation_prompt: string;
  source_samples?: number[];
  generation_settings?: Record<string, unknown>;
  generation_status: string;
  generation_error?: string;
  spectral_centroid?: number;
  spectral_rolloff?: number;
  zero_crossing_rate?: number;
  mfcc_features?: number[][];
  rhythm_pattern?: Record<string, unknown>;
  harmonic_content?: Record<string, unknown>;
  loudness?: number;
  energy?: number;
  complexity?: number;
  intensity?: number;
  tags?: string[];
  mood?: string;
  genre?: string;
  created_at: string;
  updated_at: string;
}
