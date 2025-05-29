import { API_URL } from "./constants";

export const getTracks = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/tracks`, {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tracks");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tracks:", error);
    throw error;
  }
};

export const getTrack = async (token: string, trackId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/tracks/${trackId}`, {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch track");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching track:", error);
    throw error;
  }
};

export const createTrack = async (token: string, trackData: File) => {
  try {
    const formData = new FormData();
    formData.append("file", trackData);

    const response = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to create track");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating track:", error);
    throw error;
  }
};
