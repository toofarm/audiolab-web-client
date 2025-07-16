import { getSession } from "../session";
import { SamplesService } from "./samples";
import { SERVER_API_URL } from "../constants";

export const createServerSamplesService = (): SamplesService => {
  return new SamplesService(
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
