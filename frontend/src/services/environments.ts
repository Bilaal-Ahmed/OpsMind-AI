import api from "./api";

export interface Environment {
  id: string;
  project_id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEnvironmentPayload {
  project_id: string;
  name: string;
  description: string;
}

export async function getProjectEnvironments(
  projectId: string,
): Promise<Environment[]> {
  const response = await api.get<Environment[]>(
    `/api/environments/project/${projectId}`,
  );

  return response.data;
}

export async function createEnvironment(
  payload: CreateEnvironmentPayload,
): Promise<Environment> {
  const response = await api.post<Environment>(
    "/api/environments",
    payload,
  );

  return response.data;
}