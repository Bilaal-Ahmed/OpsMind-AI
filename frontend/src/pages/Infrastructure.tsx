import { useCallback, useEffect, useState } from "react";

import CreateEnvironmentForm from "../components/CreateEnvironmentForm";
import CreateProjectForm from "../components/CreateProjectForm";
import CreateResourceForm from "../components/CreateResourceForm";
import CreateServiceForm from "../components/CreateServiceForm";
import ResourceList from "../components/ResourceList";
import ServiceList from "../components/ServiceList";
import {
    getProjectEnvironments,
    type Environment,
} from "../services/environments";
import { getProjects, type Project } from "../services/projects";

interface ProjectWithEnvironments extends Project {
    environments: Environment[];
}

export default function Infrastructure() {
    const [projects, setProjects] = useState<ProjectWithEnvironments[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProjects = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const projectData = await getProjects();
            const projectsWithEnvironments = await Promise.all(
                projectData.map(async (project) => {
                    const environments = await getProjectEnvironments(project.id);

                    return {
                        ...project,
                        environments,
                    };
                }),
            );

            setProjects(projectsWithEnvironments);
        } catch {
            setError("Unable to load infrastructure data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Infrastructure</h1>

                <p className="mt-1 text-sm text-slate-400">
                    Manage projects, environments, and connected infrastructure.
                </p>
            </div>

            <CreateProjectForm onCreated={loadProjects} />

            {loading && (
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
                    Loading infrastructure...
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
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {project.name}
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-400">
                                        {project.description || "No description provided."}
                                    </p>
                                </div>

                                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                                    {project.status}
                                </span>
                            </div>

                            <div className="mt-5 border-t border-slate-800 pt-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-200">
                                        Environments
                                    </h3>

                                    <span className="text-xs text-slate-500">
                                        {project.environments.length}{" "}
                                        environment
                                        {project.environments.length !== 1 ? "s" : ""}
                                    </span>
                                </div>

                                {project.environments.length === 0 ? (
                                    <p className="mt-3 text-sm text-slate-500">
                                        No environments configured.
                                    </p>
                                ) : (
                                    <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                        {project.environments.map((environment) => (
                                            <div
                                                key={environment.id}
                                                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <h4 className="text-sm font-semibold">
                                                        {environment.name}
                                                    </h4>

                                                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-400">
                                                        {environment.status}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-xs text-slate-500">
                                                    {environment.description || "No description provided."}
                                                </p>

                                                <div className="mt-4">
                                                    <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                        Resources
                                                    </h5>

                                                    <ResourceList environmentId={environment.id} />

                                                    <CreateResourceForm
                                                        projectId={project.id}
                                                        environmentId={environment.id}
                                                        onCreated={loadProjects}
                                                    />
                                                </div>

                                                <div className="mt-5 border-t border-slate-800 pt-5">
                                                    <div className="flex items-center justify-between">
                                                        <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            Services
                                                        </h5>
                                                    </div>

                                                    <ServiceList environmentId={environment.id} />

                                                    <CreateServiceForm
                                                        projectId={project.id}
                                                        environmentId={environment.id}
                                                        onCreated={loadProjects}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <CreateEnvironmentForm
                                    projectId={project.id}
                                    onCreated={loadProjects}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}