import {
  get_samples,
  get_sample,
  upload_sample,
  update_sample,
  delete_sample,
  get_sample_analysis,
  get_sample_categories,
  get_sample_tags,
} from "../samples";
import { CLIENT_API_URL } from "../constants";

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

export class SamplesService {
  private getToken: () => Promise<string>;
  private getServerUrl: () => string;

  constructor(getToken: () => Promise<string>, getServerUrl: () => string) {
    this.getToken = getToken;
    this.getServerUrl = getServerUrl;
  }

  async getAll(
    page: number = 1,
    per_page: number = 20,
    filters?: SampleFilter
  ): Promise<SampleList> {
    const token = await this.getToken(); // Ensure we have a valid session
    return get_samples(page, per_page, this.getServerUrl(), token, filters);
  }

  async getById(id: number): Promise<Sample> {
    const token = await this.getToken(); // Ensure we have a valid session
    return get_sample(id, this.getServerUrl(), token);
  }

  async create(
    file: File,
    name: string,
    description: string = "",
    category: "musical" | "ambient" | "percussion" | "fx" | "voice" = "musical"
  ): Promise<SampleUploadResponse> {
    const token = await this.getToken(); // Ensure we have a valid session
    return upload_sample(
      file,
      name,
      description,
      category,
      this.getServerUrl(),
      token
    );
  }

  async update(id: number, updates: Partial<Sample>): Promise<Sample> {
    const token = await this.getToken(); // Ensure we have a valid session
    return update_sample(id, updates, this.getServerUrl(), token);
  }

  async delete(id: number): Promise<void> {
    const token = await this.getToken(); // Ensure we have a valid session
    return delete_sample(id, this.getServerUrl(), token);
  }

  async getAnalysis(id: number): Promise<SampleAnalysis> {
    const token = await this.getToken(); // Ensure we have a valid session
    return get_sample_analysis(id, this.getServerUrl(), token);
  }

  async getCategories(): Promise<{ categories: CategoryCount[] }> {
    const token = await this.getToken(); // Ensure we have a valid session
    return get_sample_categories(this.getServerUrl(), token);
  }

  async getTags(): Promise<{ tags: TagCount[] }> {
    const token = await this.getToken(); // Ensure we have a valid session
    return get_sample_tags(this.getServerUrl(), token);
  }
}

// Factory functions for different contexts
export const createClientSamplesService = (): SamplesService => {
  return new SamplesService(
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
