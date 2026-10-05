import { useEffect, useState } from "react";
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    Box,
    CheckCircle2,
    Cloud,
    Cpu,
    Server,
    ShieldCheck,
    Zap,
} from "lucide-react";

import { getResourceCount } from "../services/resources";
import { getServiceCount } from "../services/services";
import { getActiveAlertCount } from "../services/alerts";

export default function Dashboard() {
    const [resourceCount, setResourceCount] = useState(0);
    const [serviceCount, setServiceCount] = useState(0);
    const [alertCount, setAlertCount] = useState(0);

    useEffect(() => {
        async function loadDashboardData() {
            try {
                const [resourceData, serviceData, alertData] =
                    await Promise.all([
                        getResourceCount(),
                        getServiceCount(),
                        getActiveAlertCount(),
                    ]);

                setResourceCount(resourceData.total);
                setServiceCount(serviceData.total);
                setAlertCount(alertData.total);
            } catch (error) {
                console.error(
                    "Failed to load dashboard data:",
                    error,
                );
            }
        }

        loadDashboardData();
    }, []);

    const healthStatus =
        alertCount === 0 ? "All systems healthy" : "Attention required";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                            <Activity className="h-4 w-4 text-cyan-400" />
                        </div>

                        <span className="text-xs font-medium uppercase tracking-wider text-cyan-400">
                            Operations Center
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-slate-400">
                        Monitor your infrastructure and operations from one
                        place.
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>

                    <span className="text-xs font-medium text-emerald-400">
                        {healthStatus}
                    </span>
                </div>
            </div>

            {/* Overview cards */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {/* Infrastructure */}
                <div className="group rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-500/30">
                    <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                            <Server className="h-5 w-5 text-cyan-400" />
                        </div>

                        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-2 py-1 text-[10px] font-medium text-cyan-400">
                            CONNECTED
                        </span>
                    </div>

                    <p className="mt-5 text-sm text-slate-400">
                        Infrastructure
                    </p>

                    <div className="mt-1 flex items-end gap-2">
                        <p className="text-3xl font-bold text-white">
                            {resourceCount}
                        </p>

                        <span className="mb-1 text-xs text-slate-500">
                            resources
                        </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                        Resources connected to OpsMind
                    </p>
                </div>

                {/* Services */}
                <div className="group rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-violet-500/30">
                    <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
                            <Box className="h-5 w-5 text-violet-400" />
                        </div>

                        <span className="rounded-full border border-violet-500/20 bg-violet-500/5 px-2 py-1 text-[10px] font-medium text-violet-400">
                            MONITORED
                        </span>
                    </div>

                    <p className="mt-5 text-sm text-slate-400">
                        Services
                    </p>

                    <div className="mt-1 flex items-end gap-2">
                        <p className="text-3xl font-bold text-white">
                            {serviceCount}
                        </p>

                        <span className="mb-1 text-xs text-slate-500">
                            services
                        </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                        Services currently under monitoring
                    </p>
                </div>

                {/* Alerts */}
                <div
                    className={`group rounded-xl border bg-slate-900 p-5 transition ${alertCount > 0
                            ? "border-amber-500/30 hover:border-amber-500/50"
                            : "border-slate-800 hover:border-emerald-500/30"
                        }`}
                >
                    <div className="flex items-start justify-between">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg border ${alertCount > 0
                                    ? "border-amber-500/20 bg-amber-500/10"
                                    : "border-emerald-500/20 bg-emerald-500/10"
                                }`}
                        >
                            {alertCount > 0 ? (
                                <AlertTriangle className="h-5 w-5 text-amber-400" />
                            ) : (
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            )}
                        </div>

                        <span
                            className={`rounded-full border px-2 py-1 text-[10px] font-medium ${alertCount > 0
                                    ? "border-amber-500/20 bg-amber-500/5 text-amber-400"
                                    : "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                                }`}
                        >
                            {alertCount > 0 ? "ACTION" : "CLEAR"}
                        </span>
                    </div>

                    <p className="mt-5 text-sm text-slate-400">
                        Active Alerts
                    </p>

                    <div className="mt-1 flex items-end gap-2">
                        <p className="text-3xl font-bold text-white">
                            {alertCount}
                        </p>

                        <span className="mb-1 text-xs text-slate-500">
                            incidents
                        </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                        {alertCount > 0
                            ? "Issues require your attention"
                            : "No active incidents detected"}
                    </p>
                </div>

                {/* API */}
                <div className="group rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-emerald-500/30">
                    <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                            <Zap className="h-5 w-5 text-emerald-400" />
                        </div>

                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 text-[10px] font-medium text-emerald-400">
                            ONLINE
                        </span>
                    </div>

                    <p className="mt-5 text-sm text-slate-400">
                        API Status
                    </p>

                    <p className="mt-1 text-2xl font-bold text-emerald-400">
                        Operational
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                        FastAPI + MongoDB backend
                    </p>
                </div>
            </div>

            {/* System overview */}
            <div className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 xl:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                System Overview
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Current OpsMind infrastructure state
                            </p>
                        </div>

                        <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                            <Cloud className="h-4 w-4 text-cyan-400" />

                            <p className="mt-3 text-xs text-slate-500">
                                Environments
                            </p>

                            <p className="mt-1 text-lg font-semibold text-white">
                                3
                            </p>

                            <p className="mt-1 text-[11px] text-emerald-400">
                                Development · Staging · Production
                            </p>
                        </div>

                        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                            <Cpu className="h-4 w-4 text-violet-400" />

                            <p className="mt-3 text-xs text-slate-500">
                                Monitoring
                            </p>

                            <p className="mt-1 text-lg font-semibold text-white">
                                Active
                            </p>

                            <p className="mt-1 text-[11px] text-emerald-400">
                                Metrics collection enabled
                            </p>
                        </div>

                        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                            <Activity className="h-4 w-4 text-cyan-400" />

                            <p className="mt-3 text-xs text-slate-500">
                                AI Assistant
                            </p>

                            <p className="mt-1 text-lg font-semibold text-white">
                                Ready
                            </p>

                            <p className="mt-1 text-[11px] text-emerald-400">
                                Infrastructure analysis enabled
                            </p>
                        </div>

                        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                            <ShieldCheck className="h-4 w-4 text-emerald-400" />

                            <p className="mt-3 text-xs text-slate-500">
                                Platform
                            </p>

                            <p className="mt-1 text-lg font-semibold text-white">
                                Healthy
                            </p>

                            <p className="mt-1 text-[11px] text-emerald-400">
                                Core services operational
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                    <div className="mb-5">
                        <h2 className="text-sm font-semibold text-white">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Jump to common operations
                        </p>
                    </div>

                    <div className="space-y-2">
                        <a
                            href="/infrastructure"
                            className="group flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 transition hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        >
                            <div className="flex items-center gap-3">
                                <Server className="h-4 w-4 text-cyan-400" />

                                <span className="text-sm text-slate-300">
                                    View Infrastructure
                                </span>
                            </div>

                            <ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400" />
                        </a>

                        <a
                            href="/monitoring"
                            className="group flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 transition hover:border-violet-500/30 hover:bg-violet-500/5"
                        >
                            <div className="flex items-center gap-3">
                                <Activity className="h-4 w-4 text-violet-400" />

                                <span className="text-sm text-slate-300">
                                    Open Monitoring
                                </span>
                            </div>

                            <ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-violet-400" />
                        </a>

                        <a
                            href="/alerts"
                            className="group flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 transition hover:border-amber-500/30 hover:bg-amber-500/5"
                        >
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="h-4 w-4 text-amber-400" />

                                <span className="text-sm text-slate-300">
                                    Review Alerts
                                </span>
                            </div>

                            <ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-amber-400" />
                        </a>

                        <a
                            href="/assistant"
                            className="group flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 transition hover:border-emerald-500/30 hover:bg-emerald-500/5"
                        >
                            <div className="flex items-center gap-3">
                                <Zap className="h-4 w-4 text-emerald-400" />

                                <span className="text-sm text-slate-300">
                                    Ask OpsMind AI
                                </span>
                            </div>

                            <ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-400" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom status */}
            <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-200">
                            OpsMind platform operational
                        </p>

                        <p className="text-xs text-slate-500">
                            Infrastructure monitoring and AI operations are
                            available.
                        </p>
                    </div>
                </div>

                <span className="text-xs text-slate-600">
                    Real-time operational dashboard
                </span>
            </div>
        </div>
    );
}