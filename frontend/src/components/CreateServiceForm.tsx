import { useState, type FormEvent } from "react";

import { createService } from "../services/services";

interface CreateServiceFormProps {
    projectId: string;
    environmentId: string;
    resourceId?: string | null;
    onCreated: () => void;
}

export default function CreateServiceForm({
    projectId,
    environmentId,
    resourceId = null,
    onCreated,
}: CreateServiceFormProps) {
    const [name, setName] = useState("");
    const [serviceType, setServiceType] = useState("application");
    const [provider, setProvider] = useState("custom");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!name.trim()) {
            setError("Service name is required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await createService({
                project_id: projectId,
                environment_id: environmentId,
                resource_id: resourceId,
                name: name.trim(),
                service_type: serviceType,
                provider: provider.trim() || "custom",
                status: "active",
                description: description.trim(),
            });

            setName("");
            setServiceType("application");
            setProvider("custom");
            setDescription("");

            onCreated();
        } catch (error) {
            console.error("Failed to create service:", error);
            setError("Unable to create service.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 rounded-lg border border-slate-800 bg-slate-900 p-4"
        >
            <h3 className="text-sm font-semibold text-slate-200">
                Add Service
            </h3>

            <div className="mt-3 space-y-3">
                <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Service name (e.g. Nginx)"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />

                <select
                    value={serviceType}
                    onChange={(event) =>
                        setServiceType(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                >
                    <option value="application">Application</option>
                    <option value="api">API</option>
                    <option value="web_server">Web Server</option>
                    <option value="database">Database</option>
                    <option value="container">Container</option>
                    <option value="orchestration">Orchestration</option>
                    <option value="infrastructure_as_code">
                        Infrastructure as Code
                    </option>
                    <option value="ci_cd">CI/CD</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="logging">Logging</option>
                    <option value="cache">Cache</option>
                    <option value="message_queue">
                        Message Queue
                    </option>
                    <option value="other">Other</option>
                </select>

                <input
                    type="text"
                    value={provider}
                    onChange={(event) => setProvider(event.target.value)}
                    placeholder="Provider (e.g. Nginx, MongoDB, Docker)"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />

                <input
                    type="text"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                    placeholder="Description"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />

                {error && (
                    <p className="text-sm text-red-400">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Add Service"}
                </button>
            </div>
        </form>
    );
}