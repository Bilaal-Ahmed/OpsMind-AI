import api from "./api";

export interface Service {
    id: string;
    project_id: string;
    environment_id: string;
    resource_id: string | null;
    name: string;
    service_type: string;
    provider: string;
    status: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface CreateServicePayload {
    project_id: string;
    environment_id: string;
    resource_id?: string | null;
    name: string;
    service_type: string;
    provider: string;
    status: string;
    description: string;
}

export interface ServiceCountResponse {
    total: number;
}

export async function getEnvironmentServices(
    environmentId: string,
): Promise<Service[]> {
    const response = await api.get<Service[]>(
        `/api/services/environment/${environmentId}`,
    );

    return response.data;
}

export async function createService(
    payload: CreateServicePayload,
): Promise<Service> {
    const response = await api.post<Service>(
        "/api/services",
        payload,
    );

    return response.data;
}

export async function getServiceCount(): Promise<ServiceCountResponse> {
    const response = await api.get<ServiceCountResponse>(
        "/api/services/count",
    );

    return response.data;
}
export async function deleteService(
    serviceId: string,
): Promise<void> {
    await api.delete(`/api/services/${serviceId}`);
}