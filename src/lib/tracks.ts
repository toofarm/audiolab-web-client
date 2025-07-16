export const getTracks = async (token: string, serverUrl: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/tracks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export const getTrack = async (
  trackId: string,
  token: string,
  serverUrl: string
) => {
  try {
    const response = await fetch(`${serverUrl}/api/tracks/${trackId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export const createTrack = async (
  trackData: File,
  token: string,
  serverUrl: string
) => {
  try {
    const formData = new FormData();
    formData.append("file", trackData);

    const response = await fetch(`${serverUrl}/api/upload`, {
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

export const deleteTrack = async (
  trackId: string,
  token: string,
  serverUrl: string
) => {
  try {
    const response = await fetch(`${serverUrl}/api/tracks/${trackId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete track");
    }

    return true;
  } catch (error) {
    console.error("Error deleting track:", error);
    throw error;
  }
};

export const updateTrack = async (
  trackId: string,
  trackData: File,
  token: string,
  serverUrl: string
) => {
  try {
    const formData = new FormData();
    formData.append("file", trackData);

    const response = await fetch(`${serverUrl}/api/tracks/${trackId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to update track");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating track:", error);
    throw error;
  }
};
