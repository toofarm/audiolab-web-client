import {
  Sample,
  SampleList,
  SampleUploadResponse,
  SampleAnalysis,
  SampleFilter,
  CategoryCount,
  TagCount,
} from "./dto/samples";

export async function getSession(): Promise<string> {
  const response = await fetch("/api/auth/session");
  if (!response.ok) {
    throw new Error("Failed to get session");
  }
  const data = await response.json();
  return data.token;
}

export async function get_samples(
  page: number = 1,
  per_page: number = 20,
  serverUrl: string,
  token: string,
  filters?: SampleFilter
): Promise<SampleList> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
    ...(filters?.category && { category: filters.category }),
    ...(filters?.tags && { tags: filters.tags.join(",") }),
    ...(filters?.mood && { mood: filters.mood }),
    ...(filters?.genre && { genre: filters.genre }),
    ...(filters?.min_duration && {
      min_duration: filters.min_duration.toString(),
    }),
    ...(filters?.max_duration && {
      max_duration: filters.max_duration.toString(),
    }),
    ...(filters?.min_tempo && { min_tempo: filters.min_tempo.toString() }),
    ...(filters?.max_tempo && { max_tempo: filters.max_tempo.toString() }),
    ...(filters?.key_signature && { key_signature: filters.key_signature }),
    ...(filters?.min_energy && { min_energy: filters.min_energy.toString() }),
    ...(filters?.max_energy && { max_energy: filters.max_energy.toString() }),
    ...(filters?.min_intensity && {
      min_intensity: filters.min_intensity.toString(),
    }),
    ...(filters?.max_intensity && {
      max_intensity: filters.max_intensity.toString(),
    }),
    ...(filters?.is_generated !== undefined && {
      is_generated: filters.is_generated.toString(),
    }),
    ...(filters?.search && { search: filters.search }),
  });

  const response = await fetch(`${serverUrl}/api/samples?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch samples");
  }

  return response.json();
}

export async function get_sample(
  sample_id: number,
  serverUrl: string,
  token: string
): Promise<Sample> {
  const response = await fetch(`${serverUrl}/api/samples/${sample_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sample");
  }

  return response.json();
}

export async function upload_sample(
  file: File,
  name: string,
  description: string = "",
  category: "musical" | "ambient" | "percussion" | "fx" | "voice" = "musical",
  serverUrl: string,
  token: string
): Promise<SampleUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const params = new URLSearchParams({
    name,
    category,
    ...(description && { description }),
  });

  const response = await fetch(`${serverUrl}/api/samples/upload?${params}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to upload sample");
  }

  return response.json();
}

export async function update_sample(
  sample_id: number,
  updates: Partial<Sample>,
  serverUrl: string,
  token: string
): Promise<Sample> {
  const response = await fetch(`${serverUrl}/api/samples/${sample_id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update sample");
  }

  return response.json();
}

export async function delete_sample(
  sample_id: number,
  serverUrl: string,
  token: string
): Promise<void> {
  const response = await fetch(`${serverUrl}/api/samples/${sample_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete sample");
  }
}

export async function get_sample_analysis(
  sample_id: number,
  serverUrl: string,
  token: string
): Promise<SampleAnalysis> {
  const response = await fetch(
    `${serverUrl}/api/samples/${sample_id}/analysis`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch sample analysis");
  }

  return response.json();
}

export async function get_sample_categories(
  serverUrl: string,
  token: string
): Promise<{ categories: CategoryCount[] }> {
  const response = await fetch(`${serverUrl}/api/samples/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sample categories");
  }

  return response.json();
}

export async function get_sample_tags(
  serverUrl: string,
  token: string
): Promise<{ tags: TagCount[] }> {
  const response = await fetch(`${serverUrl}/api/samples/tags`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sample tags");
  }

  return response.json();
}

export function get_sample_stream_url(
  sample_id: number,
  serverUrl: string
): string {
  return `${serverUrl}/api/samples/${sample_id}/stream`;
}
