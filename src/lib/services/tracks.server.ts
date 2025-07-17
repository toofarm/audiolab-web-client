import { getSession } from "../session";
import { TracksService } from "./tracks";
import { SERVER_API_URL } from "../constants";

export const createServerTracksService = (): TracksService => {
  return new TracksService(
    async () => {
      const token = await getSession();
      if (!token) {
        throw new Error("No session found");
      }
      return token;
    },
    () => SERVER_API_URL
  );
};
