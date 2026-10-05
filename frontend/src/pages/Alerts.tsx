import { useCallback, useEffect, useState } from "react";

import AlertCard from "../components/AlertCard";

import {
    getEnvironmentAlerts,
    type Alert,
} from "../services/alerts";

import {
    getProjectEnvironments,
    type Environment,
} from "../services/environments";

import {
    getProjects,
    type Project,
} from "../services/projects";

interface EnvironmentWithAlerts extends Environment {
    alerts: Alert[];
}

interface ProjectWithAlerts extends Project {
    environments: EnvironmentWithAlerts[];
}

export default function Alerts() {
    const [projects, setProjects] = useState<ProjectWithAlerts[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAlerts = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const projectData = await getProjects();

            const projectsWithAlerts = await Promise.all(
                projectData.map(async (project) => {
                    const environments =
                        await getProjectEnvironments(project.id);

                    const environmentsWithAlerts =
                        await Promise.all(
                            environments.map(async (environment) => {
                                const alerts =
                                    await getEnvironmentAlerts(
                                        environment.id,
                                    );

                                return {
                                    ...environment,
                                    alerts,
                                };
                            }),
                        );

                    return {
                        ...project,
                        environments: environmentsWithAlerts,
                    };
                }),
            );

            setProjects(projectsWithAlerts);
        } catch (error) {
            console.error(
                "Failed to load alerts:",
                error,
            );

            setError("Unable to load alerts.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAlerts();
    }, [loadAlerts]);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">
                    Alerts
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                    Review infrastructure incidents and operational
                    warnings.
                </p>
            </div>

            {loading && (
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
                    Loading alerts...
                </div>
            )}

            {error && (
                <div className="rounded-xl border border-red-900 bg-red-950/30 p-6 text-red-400">
                    {error}
                </div>
            )}

            {!loading && !error && projects.length === 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
                    No projects found.
                </div>
            )}

            {!loading && !error && projects.length > 0 && (
                <div className="space-y-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                        >
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {project.name}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {project.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            <div className="mt-5 space-y-5">
                                {project.environments.map(
                                    (environment) => (
                                        <div
                                            key={environment.id}
                                            className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                                        >
                                            <div className="mb-4 flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-slate-200">
                                                    {environment.name}
                                                </h3>

                                                <span className="text-xs text-slate-500">
                                                    {
                                                        environment
                                                            .alerts
                                                            .length
                                                    }{" "}
                                                    alert
                                                    {environment
                                                        .alerts
                                                        .length !== 1
                                                        ? "s"
                                                        : ""}
                                                </span>
                                            </div>

                                            {environment.alerts
                                                .length === 0 ? (
                                                <p className="text-sm text-slate-500">
                                                    No alerts for this
                                                    environment.
                                                </p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {environment.alerts.map(
                                                        (alert) => (
                                                            <AlertCard
                                                                key={
                                                                    alert.id
                                                                }
                                                                alert={
                                                                    alert
                                                                }
                                                                onUpdated={
                                                                    loadAlerts
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
