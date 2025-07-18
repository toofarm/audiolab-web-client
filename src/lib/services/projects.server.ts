import { getSession } from "../session";
import { ProjectsService } from "./projects";
import { SERVER_API_URL } from "../constants";

export const createServerProjectsService = (): ProjectsService => {
  return new ProjectsService(
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
