import api from "./api";

export interface MonitoringRecord {
    id: string;
    project_id: string;
    environment_id: string;
    resource_id: string | null;
    service_id: string | null;
    status: string;
    resource_name: string | null;
    service_name: string | null;
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    response_time: number;
    created_at: string;
    updated_at: string;
}

export interface MonitoringRecord {
    id: string;
    project_id: string;
    environment_id: string;
    resource_id: string | null;
    resource_name: string | null;
    service_id: string | null;
    service_name: string | null;
    status: string;
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    response_time: number;
    created_at: string;
    updated_at: string;
}

export interface CreateMonitoringPayload {
    project_id: string;
    environment_id: string;
    resource_id?: string | null;
    service_id?: string | null;
    status: string;
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    response_time: number;
}

export async function getEnvironmentMonitoring(
    environmentId: string,
): Promise<MonitoringRecord[]> {
    const response = await api.get<MonitoringRecord[]>(
        `/api/monitoring/environment/${environmentId}`,
    );

    return response.data;
}

export async function createMonitoring(
    payload: CreateMonitoringPayload,
): Promise<MonitoringRecord> {
    const response = await api.post<MonitoringRecord>(
        "/api/monitoring",
        payload,
    );

    return response.data;
}