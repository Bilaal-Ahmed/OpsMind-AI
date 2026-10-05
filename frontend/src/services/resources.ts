import api from "./api";

export interface Resource {
    id: string;
    project_id: string;
    environment_id: string;
    name: string;
    resource_type: string;
    provider: string;
    status: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface CreateResourcePayload {
    project_id: string;
    environment_id: string;
    name: string;
    resource_type: string;
    provider: string;
    status: string;
    description: string;
}

export async function getEnvironmentResources(
    environmentId: string,
): Promise<Resource[]> {
    const response = await api.get<Resource[]>(
        `/api/resources/environment/${environmentId}`,
    );

    return response.data;
}

export async function createResource(
    payload: CreateResourcePayload,
): Promise<Resource> {
    const response = await api.post<Resource>(
        "/api/resources",
        payload,
    );

    return response.data;
}

export async function deleteResource(
    resourceId: string,
): Promise<void> {
    await api.delete(`/api/resources/${resourceId}`);
}
export interface ResourceCountResponse {
    total: number;
}

export async function getResourceCount(): Promise<ResourceCountResponse> {
    const response = await api.get<ResourceCountResponse>(
        "/api/resources/count",
    );

    return response.data;
}