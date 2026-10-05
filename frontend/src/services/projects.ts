import api from "./api";

export interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface CreateProjectPayload {
    name: string;
    description?: string;
}

export async function getProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>("/api/projects");

    return response.data;
}

export async function createProject(
    payload: CreateProjectPayload,
): Promise<Project> {
    const response = await api.post<Project>("/api/projects", payload);

    return response.data;
}

export async function deleteProject(projectId: string): Promise<void> {
    await api.delete(`/api/projects/${projectId}`);
}