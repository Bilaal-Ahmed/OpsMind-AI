import { useCallback, useEffect, useState } from "react";
import {
    Server,
    Cloud,
    Database,
    Box,
    Cpu,
    Trash2,
} from "lucide-react";

import {
    deleteResource,
    getEnvironmentResources,
    type Resource,
} from "../services/resources";

interface ResourceListProps {
    environmentId: string;
    refreshKey?: number;
}

function getResourceIcon(resourceType: string) {
    switch (resourceType.toLowerCase()) {
        case "server":
            return Server;
        case "cloud":
            return Cloud;
        case "database":
            return Database;
        case "container":
            return Box;
        default:
            return Cpu;
    }
}

export default function ResourceList({
    environmentId,
    refreshKey,
}: ResourceListProps) {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadResources = useCallback(async () => {
        try {
            setLoading(true);

            const data = await getEnvironmentResources(environmentId);

            setResources(data);
        } catch (error) {
            console.error("Failed to load resources:", error);
        } finally {
            setLoading(false);
        }
    }, [environmentId]);

    useEffect(() => {
        loadResources();
    }, [loadResources, refreshKey]);

    async function handleDelete(resource: Resource) {
        const confirmed = window.confirm(
            `Delete "${resource.name}"? This action cannot be undone.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(resource.id);

            await deleteResource(resource.id);

            setResources((currentResources) =>
                currentResources.filter(
                    (item) => item.id !== resource.id,
                ),
            );
        } catch (error) {
            console.error("Failed to delete resource:", error);

            window.alert("Unable to delete resource.");
        } finally {
            setDeletingId(null);
        }
    }

    if (loading) {
        return (
            <p className="mt-3 text-sm text-slate-500">
                Loading resources...
            </p>
        );
    }

    if (resources.length === 0) {
        return (
            <p className="mt-3 text-sm text-slate-500">
                No resources configured.
            </p>
        );
    }

    return (
        <div className="mt-3 space-y-2">
            {resources.map((resource) => {
                const Icon = getResourceIcon(resource.resource_type);
                const isDeleting = deletingId === resource.id;

                return (
                    <div
                        key={resource.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900 p-3"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="rounded-md bg-slate-800 p-2">
                                <Icon className="h-4 w-4 text-cyan-400" />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-200">
                                    {resource.name}
                                </p>

                                <p className="text-xs text-slate-500">
                                    {resource.resource_type} •{" "}
                                    {resource.provider}
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                                {resource.status}
                            </span>

                            <button
                                type="button"
                                onClick={() => handleDelete(resource)}
                                disabled={isDeleting}
                                title="Delete resource"
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