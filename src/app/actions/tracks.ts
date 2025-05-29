"use server";

import { createTrack } from "@/lib/tracks";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

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
