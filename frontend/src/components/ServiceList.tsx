import { useCallback, useEffect, useState } from "react";

import {
    Activity,
    Box,
    Cloud,
    Code,
    Database,
    GitBranch,
    Globe,
    Layers,
    Server,
    Settings,
    Terminal,
    Trash2,
} from "lucide-react";

import {
    deleteService,
    getEnvironmentServices,
    type Service,
} from "../services/services";

interface ServiceListProps {
    environmentId: string;
    refreshKey?: number;
}

function getServiceIcon(serviceType: string) {
    switch (serviceType.toLowerCase()) {
        case "api":
            return Code;
        case "web_server":
            return Globe;
        case "database":
            return Database;
        case "container":
            return Box;
        case "orchestration":
            return Layers;
        case "infrastructure_as_code":
            return Terminal;
        case "ci_cd":
            return GitBranch;
        case "monitoring":
            return Activity;
        case "logging":
            return Server;
        case "cache":
            return Cloud;
        default:
            return Settings;
    }
}

export default function ServiceList({
    environmentId,
    refreshKey,
}: ServiceListProps) {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadServices = useCallback(async () => {
        try {
            setLoading(true);

            const data = await getEnvironmentServices(environmentId);

            setServices(data);
        } catch (error) {
            console.error("Failed to load services:", error);
        } finally {
            setLoading(false);
        }
    }, [environmentId]);

    useEffect(() => {
        loadServices();
    }, [loadServices, refreshKey]);

    async function handleDelete(service: Service) {
        const confirmed = window.confirm(
            `Delete "${service.name}"? This action cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(service.id);

            await deleteService(service.id);

            setServices((currentServices) =>
                currentServices.filter(
                    (item) => item.id !== service.id,
                ),
            );
        } catch (error) {
            console.error("Failed to delete service:", error);
            window.alert("Unable to delete service.");
        } finally {
            setDeletingId(null);
        }
    }

    if (loading) {
        return (
            <p className="mt-3 text-sm text-slate-500">
                Loading services...
            </p>
        );
    }

    if (services.length === 0) {
        return (
            <p className="mt-3 text-sm text-slate-500">
                No services configured.
            </p>
        );
    }

    return (
        <div className="mt-3 space-y-2">
            {services.map((service) => {
                const Icon = getServiceIcon(service.service_type);
                const isDeleting = deletingId === service.id;

                return (
                    <div
                        key={service.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900 p-3"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="rounded-md bg-slate-800 p-2">
                                <Icon className="h-4 w-4 text-cyan-400" />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-200">
                                    {service.name}
                                </p>

                                <p className="text-xs text-slate-500">
                                    {service.service_type} •{" "}
                                    {service.provider}
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                                {service.status}
                            </span>

                            <button
                                type="button"
                                onClick={() => handleDelete(service)}
                                disabled={isDeleting}
                                title="Delete service"
                                className="rounded-md p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}