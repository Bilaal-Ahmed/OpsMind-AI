import {
    Activity,
    Cpu,
    HardDrive,
    MemoryStick,
    Server,
    Timer,
} from "lucide-react";

import type { MonitoringRecord } from "../services/monitoring";

interface MonitoringCardProps {
    record: MonitoringRecord;
}

function getStatusClasses(status: string) {
    switch (status.toLowerCase()) {
        case "healthy":
            return "bg-emerald-500/10 text-emerald-400";
        case "warning":
            return "bg-yellow-500/10 text-yellow-400";
        case "critical":
            return "bg-red-500/10 text-red-400";
        default:
            return "bg-slate-500/10 text-slate-400";
    }
}

function Metric({
    icon: Icon,
    label,
    value,
    suffix = "%",
}: {
    icon: typeof Cpu;
    label: string;
    value: number;
    suffix?: string;
}) {
    return (
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
                <Icon className="h-4 w-4" />
                {label}
            </div>

            <p className="mt-2 text-lg font-semibold text-slate-200">
                {value}
                {suffix}
            </p>
        </div>
    );
}

export default function MonitoringCard({
    record,
}: MonitoringCardProps) {
    const targetName =
        record.resource_name ||
        record.service_name ||
        "Unknown target";

    const targetType = record.resource_name
        ? "Resource"
        : record.service_name
            ? "Service"
            : "Monitoring Target";

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-500/10 p-2">
                        <Server className="h-5 w-5 text-cyan-400" />
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                            {targetType}
                        </p>

                        <h3 className="mt-1 text-sm font-semibold text-slate-200">
                            {targetName}
                        </h3>

                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <Activity className="h-3.5 w-3.5" />
                            Monitoring Status
                        </div>
                    </div>
                </div>

                <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        record.status,
                    )}`}
                >
                    {record.status}
                </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Metric
                    icon={Cpu}
                    label="CPU Usage"
                    value={record.cpu_usage}
                />

                <Metric
                    icon={MemoryStick}
                    label="Memory Usage"
                    value={record.memory_usage}
                />

                <Metric
                    icon={HardDrive}
                    label="Disk Usage"
                    value={record.disk_usage}
                />

                <Metric
                    icon={Timer}
                    label="Response Time"
                    value={record.response_time}
                    suffix=" ms"
                />
            </div>
        </div>
    );
}