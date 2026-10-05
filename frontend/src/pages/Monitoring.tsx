import { useCallback, useEffect, useState } from "react";

import MonitoringCard from "../components/MonitoringCard";

import {
    getEnvironmentMonitoring,
    type MonitoringRecord,
} from "../services/monitoring";

import {
    getProjectEnvironments,
    type Environment,
} from "../services/environments";

import { getProjects, type Project } from "../services/projects";

interface EnvironmentWithMonitoring extends Environment {
    monitoring: MonitoringRecord[];
}

interface ProjectWithMonitoring extends Project {
    environments: EnvironmentWithMonitoring[];
}

export default function Monitoring() {
    const [projects, setProjects] = useState<ProjectWithMonitoring[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadMonitoring = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const projectData = await getProjects();

            const projectsWithMonitoring = await Promise.all(
                projectData.map(async (project) => {
                    const environments =
                        await getProjectEnvironments(project.id);

                    const environmentsWithMonitoring =
                        await Promise.all(
                            environments.map(async (environment) => {
                                const monitoring =
                                    await getEnvironmentMonitoring(
                                        environment.id,
                                    );

                                return {
                                    ...environment,
                                    monitoring,
                                };
                            }),
                        );

                    return {
                        ...project,
                        environments: environmentsWithMonitoring,
                    };
                }),
            );

            setProjects(projectsWithMonitoring);
        } catch (error) {
            console.error(
                "Failed to load monitoring data:",
                error,
            );

            setError("Unable to load monitoring data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMonitoring();
    }, [loadMonitoring]);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">
                    Monitoring
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                    Monitor infrastructure health and operational
                    metrics.
                </p>
            </div>

            {loading && (
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
                    Loading monitoring data...
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
                                                            .monitoring
                                                            .length
                                                    }{" "}
                                                    record
                                                    {environment
                                                        .monitoring
                                                        .length !== 1
                                                        ? "s"
                                                        : ""}
                                                </span>
                                            </div>

                                            {environment.monitoring
                                                .length === 0 ? (
                                                <p className="text-sm text-slate-500">
                                                    No monitoring data
                                                    available.
                                                </p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {environment.monitoring.map(
                                                        (
                                                            record,
                                                        ) => (
                                                            <MonitoringCard
                                                                key={
                                                                    record.id
                                                                }
                                                                record={
                                                                    record
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