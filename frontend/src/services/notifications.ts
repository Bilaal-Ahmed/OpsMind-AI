import api from "./api";

export interface Notification {
    id: string;
    project_id: string;
    alert_id: string;
    title: string;
    message: string;
    severity: string;
    is_read: boolean;
    created_at: string;
    read_at: string | null;
}

export interface NotificationCountResponse {
    total: number;
}

export async function getProjectNotifications(
    projectId: string,
): Promise<Notification[]> {
    const response = await api.get<Notification[]>(
        `/api/notifications/project/${projectId}`,
    );

    return response.data;
}

export async function getUnreadNotificationCount(
    projectId: string,
): Promise<NotificationCountResponse> {
    const response =
        await api.get<NotificationCountResponse>(
            `/api/notifications/project/${projectId}/unread-count`,
        );

    return response.data;
}

export async function markNotificationAsRead(
    notificationId: string,
): Promise<void> {
    await api.patch(
        `/api/notifications/${notificationId}/read`,
    );
}