import api from "./api";

export interface Alert {
    id: string;
    project_id: string;
    environment_id: string;
    resource_id: string | null;
    resource_name: string | null;
    service_id: string | null;
    service_name: string | null;
    severity: string;
    title: string;
    message: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface CreateAlertPayload {
    project_id: string;
    environment_id: string;
    resource_id?: string | null;
    service_id?: string | null;
    severity: string;
    title: string;
    message: string;
    status: string;
}

export interface AlertCountResponse {
    total: number;
}

export async function getEnvironmentAlerts(
    environmentId: string,
): Promise<Alert[]> {
    const response = await api.get<Alert[]>(
        `/api/alerts/environment/${environmentId}`,
    );

    return response.data;
}

export async function createAlert(
    payload: CreateAlertPayload,
): Promise<Alert> {
    const response = await api.post<Alert>(
        "/api/alerts",
        payload,
    );

    return response.data;
}

export async function getActiveAlertCount(): Promise<AlertCountResponse> {
    const response = await api.get<AlertCountResponse>(
        "/api/alerts/count",
    );

    return response.data;
}
export async function acknowledgeAlert(
    alertId: string,
): Promise<void> {
    await api.patch(
        `/api/alerts/${alertId}/acknowledge`,
    );
}

export async function resolveAlert(
    alertId: string,
): Promise<void> {
    await api.patch(
        `/api/alerts/${alertId}/resolve`,
    );
}