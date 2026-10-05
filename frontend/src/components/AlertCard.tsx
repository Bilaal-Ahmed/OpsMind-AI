import { useState } from "react";

import {
    AlertTriangle,
    Bell,
    Check,
    CheckCircle2,
    CircleAlert,
    Server,
    XCircle,
} from "lucide-react";

import {
    acknowledgeAlert,
    resolveAlert,
    type Alert,
} from "../services/alerts";

interface AlertCardProps {
    alert: Alert;
    onUpdated?: () => void;
}

function getSeverityClasses(severity: string) {
    switch (severity.toLowerCase()) {
        case "critical":
            return "bg-red-500/10 text-red-400 border-red-500/20";
        case "warning":
            return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
        case "info":
            return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
        default:
            return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
}

function getSeverityIcon(severity: string) {
    switch (severity.toLowerCase()) {
        case "critical":
            return XCircle;
        case "warning":
            return AlertTriangle;
        case "info":
            return CircleAlert;
        default:
            return Bell;
    }
}

function getStatusClasses(status: string) {
    switch (status.toLowerCase()) {
        case "active":
            return "bg-red-500/10 text-red-400";
        case "resolved":
            return "bg-emerald-500/10 text-emerald-400";
        case "acknowledged":
            return "bg-yellow-500/10 text-yellow-400";
        default:
            return "bg-slate-500/10 text-slate-400";
    }
}

export default function AlertCard({
    alert,
    onUpdated,
}: AlertCardProps) {
    const [loading, setLoading] = useState(false);

    const SeverityIcon = getSeverityIcon(alert.severity);

    const targetName =
        alert.resource_name ||
        alert.service_name ||
        "Unknown target";

    const targetType = alert.resource_name
        ? "Resource"
        : alert.service_name
            ? "Service"
            : "Monitoring Target";

    async function handleAcknowledge() {
        try {
            setLoading(true);

            await acknowledgeAlert(alert.id);

            onUpdated?.();
        } catch (error) {
            console.error(
                "Failed to acknowledge alert:",
                error,
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleResolve() {
        try {
            setLoading(true);

            await resolveAlert(alert.id);

            onUpdated?.();
        } catch (error) {
            console.error(
                "Failed to resolve alert:",
                error,
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                    <div
                        className={`rounded-lg border p-2 ${getSeverityClasses(
                            alert.severity,
                        )}`}
                    >
                        <SeverityIcon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-200">
                                {alert.title}
                            </h3>

                            <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getSeverityClasses(
                                    alert.severity,
                                )}`}
                            >
                                {alert.severity}
                            </span>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <Server className="h-3.5 w-3.5" />
                            <span>
                                {targetType}: {targetName}
                            </span>
                        </div>
                    </div>
                </div>

                <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        alert.status,
                    )}`}
                >
                    {alert.status}
                </span>
            </div>

            {alert.message && (
                <p className="mt-4 text-sm leading-6 text-slate-400">
                    {alert.message}
                </p>
            )}

            {alert.status !== "resolved" && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-800 pt-4">
                    {alert.status === "active" && (
                        <button
                            type="button"
                            onClick={handleAcknowledge}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-xs font-medium text-yellow-400 transition hover:bg-yellow-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Check className="h-3.5 w-3.5" />
                            {loading
                                ? "Updating..."
                                : "Acknowledge"}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleResolve}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {loading
                            ? "Updating..."
                            : "Resolve"}
                    </button>
                </div>
            )}

            <div className="mt-4 flex items-center gap-2 border-t border-slate-800 pt-3 text-xs text-slate-500">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                    Created{" "}
                    {new Date(
                        alert.created_at,
                    ).toLocaleString()}
                </span>
            </div>
        </div>
    );
}