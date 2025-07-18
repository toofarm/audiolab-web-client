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

export interface GeneratedAudioList {
  generated_audio: GeneratedAudio[];
  total: number;
  page: number;
  per_page: number;
}

export interface GenerationRequest {
  project_id: number;
  prompt: string;
  source_sample_ids?: number[];
  generation_settings?: Record<string, unknown>;
}

export interface GenerationResponse {
  generation_id: number;
  status: string;
  estimated_completion_time?: number;
  message: string;
}

export interface GenerationStatus {
  id: number;
  status: string;
  error?: string;
  created_at: string;
  updated_at: string;
}

export interface GenerationStats {
  status_counts: Record<string, number>;
  model_counts: Record<string, number>;
  total_duration: number;
  total_generated: number;
}

export interface GeneratedAudioFilter {
  project_id?: number;
  generation_status?: string;
  generation_model?: string;
  search?: string;
}
