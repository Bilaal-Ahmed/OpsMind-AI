import { useState, type FormEvent } from "react";

import { createEnvironment } from "../services/environments";

interface CreateEnvironmentFormProps {
    projectId: string;
    onCreated: () => void;
}

export default function CreateEnvironmentForm({
    projectId,
    onCreated,
}: CreateEnvironmentFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!name.trim()) {
            setError("Environment name is required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await createEnvironment({
                project_id: projectId,
                name: name.trim(),
                description: description.trim(),
            });

            setName("");
            setDescription("");
            onCreated();
        } catch {
            setError("Unable to create environment.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-4"
        >
            <h3 className="text-sm font-semibold text-slate-200">
                Add Environment
            </h3>

            <div className="mt-3 space-y-3">
                <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Environment name"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />

                <input
                    type="text"
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                    placeholder="Description"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
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
                    {loading ? "Creating..." : "Add Environment"}
                </button>
            </div>
        </form>
    );
}