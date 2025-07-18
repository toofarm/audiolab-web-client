import { getSession } from "../session";
import { GeneratedAudioService } from "./generated_audio";
import { SERVER_API_URL } from "../constants";

export const createServerGeneratedAudioService = (): GeneratedAudioService => {
  return new GeneratedAudioService(
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
