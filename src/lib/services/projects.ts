import {
  get_projects,
  get_project,
  get_project_with_samples,
  create_project,
  update_project,
  delete_project,
  get_project_samples,
  get_project_generated_audio,
  get_project_stats,
  add_sample_to_project,
  remove_sample_from_project,
} from "../projects";
import { CLIENT_API_URL } from "../constants";
import {
  Project,
  ProjectList,
  ProjectWithSamples,
  ProjectStats,
  ProjectFilter,
  Sample,
  GeneratedAudio,
} from "../dto/projects";

export class ProjectsService {
  private getToken: () => Promise<string>;
  private getServerUrl: () => string;

  constructor(getToken: () => Promise<string>, getServerUrl: () => string) {
    this.getToken = getToken;
    this.getServerUrl = getServerUrl;
  }

  async getAll(
    page: number = 1,
    per_page: number = 20,
    filters?: ProjectFilter
  ): Promise<ProjectList> {
    const token = await this.getToken();
    return get_projects(page, per_page, this.getServerUrl(), token, filters);
  }

  async getById(id: number): Promise<Project> {
    const token = await this.getToken();
    return get_project(id, this.getServerUrl(), token);
  }

  async getWithSamples(id: number): Promise<ProjectWithSamples> {
    const token = await this.getToken();
    return get_project_with_samples(id, this.getServerUrl(), token);
  }

  async create(projectData: {
    name: string;
    description?: string;
    genre?: string;
    mood?: string;
    tempo_bpm?: number;
    key_signature?: string;
    generation_model?: string;
    generation_settings?: Record<string, unknown>;
    is_public?: boolean;
  }): Promise<Project> {
    const token = await this.getToken();
    return create_project(projectData, this.getServerUrl(), token);
  }

  async update(id: number, updates: Partial<Project>): Promise<Project> {
    const token = await this.getToken();
    return update_project(id, updates, this.getServerUrl(), token);
  }

  async delete(id: number): Promise<void> {
    const token = await this.getToken();
    return delete_project(id, this.getServerUrl(), token);
  }

  async getSamples(
    project_id: number,
    page: number = 1,
    per_page: number = 20
  ): Promise<{
    samples: Sample[];
    total: number;
    page: number;
    per_page: number;
  }> {
    const token = await this.getToken();
    return get_project_samples(
      project_id,
      page,
      per_page,
      this.getServerUrl(),
      token
    );
  }

  async getGeneratedAudio(
    project_id: number,
    page: number = 1,
    per_page: number = 20,
    status?: string
  ): Promise<{
    generated_audio: GeneratedAudio[];
    total: number;
    page: number;
    per_page: number;
  }> {
    const token = await this.getToken();
    return get_project_generated_audio(
      project_id,
      page,
      per_page,
      this.getServerUrl(),
      token,
      status
    );
  }

  async getStats(project_id: number): Promise<ProjectStats> {
    const token = await this.getToken();
    return get_project_stats(project_id, this.getServerUrl(), token);
  }

  async addSample(project_id: number, sample_id: number): Promise<void> {
    const token = await this.getToken();
    return add_sample_to_project(
      project_id,
      sample_id,
      this.getServerUrl(),
      token
    );
  }

  async removeSample(project_id: number, sample_id: number): Promise<void> {
    const token = await this.getToken();
    return remove_sample_from_project(
      project_id,
      sample_id,
      this.getServerUrl(),
      token
    );
  }
}

// Factory functions for different contexts
export const createClientProjectsService = (): ProjectsService => {
  return new ProjectsService(
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
