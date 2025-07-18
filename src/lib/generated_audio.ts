import {
  GeneratedAudio,
  GeneratedAudioList,
  GenerationRequest,
  GenerationResponse,
  GenerationStatus,
  GenerationStats,
  GeneratedAudioFilter,
} from "./dto/generated_audio";

export async function request_generation(
  generation_request: GenerationRequest,
  serverUrl: string,
  token: string
): Promise<GenerationResponse> {
  const response = await fetch(`${serverUrl}/api/generated-audio`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(generation_request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to request generation");
  }

  return response.json();
}

export async function get_generated_audio(
  page: number = 1,
  per_page: number = 20,
  serverUrl: string,
  token: string,
  filters?: GeneratedAudioFilter
): Promise<GeneratedAudioList> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
    ...(filters?.project_id && { project_id: filters.project_id.toString() }),
    ...(filters?.generation_status && {
      generation_status: filters.generation_status,
    }),
    ...(filters?.generation_model && {
      generation_model: filters.generation_model,
    }),
    ...(filters?.search && { search: filters.search }),
  });

  const response = await fetch(`${serverUrl}/api/generated-audio?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch generated audio");
  }

  return response.json();
}

export async function get_generated_audio_item(
  generated_id: number,
  serverUrl: string,
  token: string
): Promise<GeneratedAudio> {
  const response = await fetch(
    `${serverUrl}/api/generated-audio/${generated_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch generated audio");
  }

  return response.json();
}

export async function update_generated_audio(
  generated_id: number,
  updates: Partial<GeneratedAudio>,
  serverUrl: string,
  token: string
): Promise<GeneratedAudio> {
  const response = await fetch(
    `${serverUrl}/api/generated-audio/${generated_id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update generated audio");
  }

  return response.json();
}

export async function delete_generated_audio(
  generated_id: number,
  serverUrl: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${serverUrl}/api/generated-audio/${generated_id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete generated audio");
  }
}

export async function get_generation_status(
  generated_id: number,
  serverUrl: string,
  token: string
): Promise<GenerationStatus> {
  const response = await fetch(
    `${serverUrl}/api/generated-audio/${generated_id}/status`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch generation status");
  }

  return response.json();
}

export async function retry_generation(
  generated_id: number,
  serverUrl: string,
  token: string
): Promise<{ message: string; status: string }> {
  const response = await fetch(
    `${serverUrl}/api/generated-audio/${generated_id}/retry`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to retry generation");
  }

  return response.json();
}

export async function cancel_generation(
  generated_id: number,
  serverUrl: string,
  token: string
): Promise<{ message: string; status: string }> {
  const response = await fetch(
    `${serverUrl}/api/generated-audio/${generated_id}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to cancel generation");
  }

  return response.json();
}

export async function get_generation_stats(
  serverUrl: string,
  token: string,
  project_id?: number
): Promise<GenerationStats> {
  const params = new URLSearchParams();
  if (project_id) {
    params.append("project_id", project_id.toString());
  }

  const response = await fetch(
    `${serverUrl}/api/generated-audio/stats?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch generation stats");
  }

  return response.json();
}

export function get_generated_audio_stream_url(
  generated_id: number,
  serverUrl: string
): string {
  return `${serverUrl}/api/generated-audio/${generated_id}/stream`;
}
