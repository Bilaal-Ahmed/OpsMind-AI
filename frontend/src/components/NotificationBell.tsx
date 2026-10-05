import { useCallback, useEffect, useState } from "react";

import { Bell, Check, X } from "lucide-react";

import {
    getProjectNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    type Notification,
} from "../services/notifications";

interface NotificationBellProps {
    projectId: string;
}

function getSeverityClasses(severity: string) {
    switch (severity.toLowerCase()) {
        case "critical":
            return "border-red-500/20 bg-red-500/10 text-red-400";

        case "warning":
            return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

        case "info":
            return "border-cyan-500/20 bg-cyan-500/10 text-cyan-400";

        default:
            return "border-slate-700 bg-slate-800 text-slate-400";
    }
}

export default function NotificationBell({
    projectId,
}: NotificationBellProps) {
    const [notifications, setNotifications] = useState<Notification[]>(
        [],
    );

    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadNotifications = useCallback(async () => {
        try {
            const [notificationData, countData] =
                await Promise.all([
                    getProjectNotifications(projectId),
                    getUnreadNotificationCount(projectId),
                ]);

            setNotifications(notificationData);
            setUnreadCount(countData.total);
        } catch (error) {
            console.error(
                "Failed to load notifications:",
                error,
            );
        }
    }, [projectId]);

    useEffect(() => {
        loadNotifications();

        const interval = window.setInterval(
            loadNotifications,
            15000,
        );

        return () => {
            window.clearInterval(interval);
        };
    }, [loadNotifications]);

    async function handleMarkAsRead(
        notification: Notification,
    ) {
        if (notification.is_read) {
            return;
        }

        try {
            setLoading(true);

            await markNotificationAsRead(notification.id);

            setNotifications((current) =>
                current.map((item) =>
                    item.id === notification.id
                        ? {
                            ...item,
                            is_read: true,
                            read_at: new Date().toISOString(),
                        }
                        : item,
                ),
            );

            setUnreadCount((current) =>
                Math.max(current - 1, 0),
            );
        } catch (error) {
            console.error(
                "Failed to mark notification as read:",
                error,
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="relative rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                title="Notifications"
            >
                <Bell className="h-5 w-5" />

                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-200">
                                Notifications
                            </h3>

                            <p className="text-xs text-slate-500">
                                {unreadCount} unread
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-800 hover:text-white"
                            title="Close"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-slate-500">
                                No notifications.
                            </div>
                        ) : (
                            notifications.map(
                                (notification) => (
                                    <div
                                        key={notification.id}
                                        className={`border-b border-slate-800 p-4 ${notification.is_read
                                                ? "opacity-60"
                                                : ""
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h4 className="text-sm font-medium text-slate-200">
                                                        {
                                                            notification.title
                                                        }
                                                    </h4>

                                                    <span
                                                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getSeverityClasses(
                                                            notification.severity,
                                                        )}`}
                                                    >
                                                        {
                                                            notification.severity
                                                        }
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs leading-5 text-slate-400">
                                                    {
                                                        notification.message
                                                    }
                                                </p>

                                                <p className="mt-2 text-[11px] text-slate-600">
                                                    {new Date(
                                                        notification.created_at,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>

                                            {!notification.is_read && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleMarkAsRead(
                                                            notification,
                                                        )
                                                    }
                                                    disabled={
                                                        loading
                                                    }
                                                    className="shrink-0 rounded-md p-1.5 text-slate-500 transition hover:bg-emerald-500/10 hover:text-emerald-400 disabled:opacity-50"
                                                    title="Mark as read"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ),
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}