import {
  Project,
  ProjectList,
  ProjectWithSamples,
  ProjectStats,
  ProjectFilter,
  Sample,
  GeneratedAudio,
} from "./dto/projects";

export async function get_projects(
  page: number = 1,
  per_page: number = 20,
  serverUrl: string,
  token: string,
  filters?: ProjectFilter
): Promise<ProjectList> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
    ...(filters?.is_active !== undefined && {
      is_active: filters.is_active.toString(),
    }),
    ...(filters?.genre && { genre: filters.genre }),
    ...(filters?.mood && { mood: filters.mood }),
    ...(filters?.search && { search: filters.search }),
  });

  const response = await fetch(`${serverUrl}/api/projects?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

export async function get_project(
  project_id: number,
  serverUrl: string,
  token: string
): Promise<Project> {
  const response = await fetch(`${serverUrl}/api/projects/${project_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  return response.json();
}

export async function get_project_with_samples(
  project_id: number,
  serverUrl: string,
  token: string
): Promise<ProjectWithSamples> {
  const response = await fetch(`${serverUrl}/api/projects/${project_id}/full`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch project with samples");
  }

  return response.json();
}

export async function create_project(
  projectData: {
    name: string;
    description?: string;
    genre?: string;
    mood?: string;
    tempo_bpm?: number;
    key_signature?: string;
    generation_model?: string;
    generation_settings?: Record<string, unknown>;
    is_public?: boolean;
  },
  serverUrl: string,
  token: string
): Promise<Project> {
  const response = await fetch(`${serverUrl}/api/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create project");
  }

  return response.json();
}

export async function update_project(
  project_id: number,
  updates: Partial<Project>,
  serverUrl: string,
  token: string
): Promise<Project> {
  const response = await fetch(`${serverUrl}/api/projects/${project_id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update project");
  }

  return response.json();
}

export async function delete_project(
  project_id: number,
  serverUrl: string,
  token: string
): Promise<void> {
  const response = await fetch(`${serverUrl}/api/projects/${project_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }
}

export async function get_project_samples(
  project_id: number,
  page: number = 1,
  per_page: number = 20,
  serverUrl: string,
  token: string
): Promise<{
  samples: Sample[];
  total: number;
  page: number;
  per_page: number;
}> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
  });

  const response = await fetch(
    `${serverUrl}/api/projects/${project_id}/samples?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch project samples");
  }

  return response.json();
}

export async function get_project_generated_audio(
  project_id: number,
  page: number = 1,
  per_page: number = 20,
  serverUrl: string,
  token: string,
  status?: string
): Promise<{
  generated_audio: GeneratedAudio[];
  total: number;
  page: number;
  per_page: number;
}> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
    ...(status && { status }),
  });

  const response = await fetch(
    `${serverUrl}/api/projects/${project_id}/generated?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch project generated audio");
  }

  return response.json();
}

export async function get_project_stats(
  project_id: number,
  serverUrl: string,
  token: string
): Promise<ProjectStats> {
  const response = await fetch(
    `${serverUrl}/api/projects/${project_id}/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch project stats");
  }

  return response.json();
}

export async function add_sample_to_project(
  project_id: number,
  sample_id: number,
  serverUrl: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${serverUrl}/api/projects/${project_id}/samples/${sample_id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add sample to project");
  }
}

export async function remove_sample_from_project(
  project_id: number,
  sample_id: number,
  serverUrl: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${serverUrl}/api/projects/${project_id}/samples/${sample_id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove sample from project");
  }
}
