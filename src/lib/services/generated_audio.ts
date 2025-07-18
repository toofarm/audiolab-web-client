import {
  request_generation,
  get_generated_audio,
  get_generated_audio_item,
  update_generated_audio,
  delete_generated_audio,
  get_generation_status,
  retry_generation,
  cancel_generation,
  get_generation_stats,
  get_generated_audio_stream_url,
} from "../generated_audio";
import { CLIENT_API_URL } from "../constants";
import {
  GeneratedAudio,
  GeneratedAudioList,
  GenerationRequest,
  GenerationResponse,
  GenerationStatus,
  GenerationStats,
  GeneratedAudioFilter,
} from "../dto/generated_audio";

export class GeneratedAudioService {
  private getToken: () => Promise<string>;
  private getServerUrl: () => string;

  constructor(getToken: () => Promise<string>, getServerUrl: () => string) {
    this.getToken = getToken;
    this.getServerUrl = getServerUrl;
  }

  async requestGeneration(
    generation_request: GenerationRequest
  ): Promise<GenerationResponse> {
    const token = await this.getToken();
    return request_generation(generation_request, this.getServerUrl(), token);
  }

  async getAll(
    page: number = 1,
    per_page: number = 20,
    filters?: GeneratedAudioFilter
  ): Promise<GeneratedAudioList> {
    const token = await this.getToken();
    return get_generated_audio(
      page,
      per_page,
      this.getServerUrl(),
      token,
      filters
    );
  }

  async getById(id: number): Promise<GeneratedAudio> {
    const token = await this.getToken();
    return get_generated_audio_item(id, this.getServerUrl(), token);
  }

  async update(
    id: number,
    updates: Partial<GeneratedAudio>
  ): Promise<GeneratedAudio> {
    const token = await this.getToken();
    return update_generated_audio(id, updates, this.getServerUrl(), token);
  }

  async delete(id: number): Promise<void> {
    const token = await this.getToken();
    return delete_generated_audio(id, this.getServerUrl(), token);
  }

  async getStatus(id: number): Promise<GenerationStatus> {
    const token = await this.getToken();
    return get_generation_status(id, this.getServerUrl(), token);
  }

  async retry(id: number): Promise<{ message: string; status: string }> {
    const token = await this.getToken();
    return retry_generation(id, this.getServerUrl(), token);
  }

  async cancel(id: number): Promise<{ message: string; status: string }> {
    const token = await this.getToken();
    return cancel_generation(id, this.getServerUrl(), token);
  }

  async getStats(project_id?: number): Promise<GenerationStats> {
    const token = await this.getToken();
    return get_generation_stats(this.getServerUrl(), token, project_id);
  }

  getStreamUrl(id: number): string {
    return get_generated_audio_stream_url(id, this.getServerUrl());
  }
}

// Factory functions for different contexts
export const createClientGeneratedAudioService = (): GeneratedAudioService => {
  return new GeneratedAudioService(
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
