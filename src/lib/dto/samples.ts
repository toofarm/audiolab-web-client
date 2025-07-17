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

  // Audio properties
  duration_sec?: number;
  sample_rate?: number;
  channels: number;

  // Musical features
  tempo_bpm?: number;
  key_signature?: string;
  time_signature?: number;

  // AI-relevant features
  spectral_centroid?: number;
  spectral_rolloff?: number;
  zero_crossing_rate?: number;
  mfcc_features?: number[][];
  rhythm_pattern?: Record<string, unknown>;
  harmonic_content?: Record<string, unknown>;

  // Perceptual features
  loudness?: number;
  energy?: number;
  complexity?: number;
  intensity?: number;

  // Classification
  tags?: string[];
  mood?: string;
  genre?: string;

  // AI generation metadata
  is_generated: number;
  source_samples?: number[];
  generation_prompt?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface SampleList {
  samples: Sample[];
  total: number;
  page: number;
  per_page: number;
}

export interface SampleUploadResponse {
  sample: Sample;
  analysis_time: number;
  message: string;
}

export interface SampleAnalysis {
  basic_properties: Record<string, unknown>;
  musical_features: Record<string, unknown>;
  spectral_features: Record<string, unknown>;
  rhythmic_features: Record<string, unknown>;
  harmonic_features: Record<string, unknown>;
  perceptual_features: Record<string, unknown>;
  classification: Record<string, unknown>;
  analysis_time: number;
}

export interface SampleFilter {
  category?: string;
  tags?: string[];
  mood?: string;
  genre?: string;
  min_duration?: number;
  max_duration?: number;
  min_tempo?: number;
  max_tempo?: number;
  key_signature?: string;
  min_energy?: number;
  max_energy?: number;
  min_intensity?: number;
  max_intensity?: number;
  is_generated?: boolean;
  search?: string;
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface TagCount {
  name: string;
  count: number;
}
