"use server";

import { createTrack, deleteTrack } from "@/lib/tracks";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { API_URL } from "@/lib/constants";

export const uploadTrack = async (data: FormData) => {
  let newTrack;

  try {
    const token = await getSession();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const track = data.get("track-file") as File;

    if (!track) {
      throw new Error("No track included in payload");
    }

    newTrack = await createTrack(token, track);

    if (!newTrack.id) {
      throw new Error("Error uploading file");
    }
  } catch (error) {
    console.error("Error uploading track:", error);
    throw error;
  } finally {
    redirect(`/tracks/${newTrack.id}`);
  }
};

export const deleteOneTrack = async (data: FormData) => {
  try {
    const token = await getSession();

    const trackId = data.get("trackId") as string;

    if (!token) {
      throw new Error("User is not authenticated");
    }

    // Assuming there's a deleteTrack function in the lib/tracks module
    const response = await deleteTrack(token, trackId);

    if (!response) {
      throw new Error("Failed to delete track");
    }
  } catch (error) {
    console.error("Error deleting track:", error);
    throw error;
  } finally {
    const path = data.get("path") as string;
    const re = data.get("redirect") as string;

    if (re === "true") {
      redirect(path || "/tracks");
    }

    if (path) {
      revalidatePath(path);
    }
  }
};

export const streamTrack = async (id: string) => {
  const token = await getSession();

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(`${API_URL}/api/tracks/${id}/stream`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to stream track with id ${id}`);
  }

  return response.body as ReadableStream;
};
