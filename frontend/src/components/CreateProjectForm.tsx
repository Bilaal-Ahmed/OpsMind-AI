import { useState, type FormEvent } from "react";

import { createProject } from "../services/projects";

interface CreateProjectFormProps {
    onCreated: () => void;
}

export default function CreateProjectForm({
    onCreated,
}: CreateProjectFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!name.trim()) {
            setError("Project name is required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await createProject({
                name: name.trim(),
                description: description.trim(),
            });

            setName("");
            setDescription("");
            onCreated();
        } catch {
            setError("Unable to create project.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-5"
        >
            <h2 className="text-lg font-semibold">
                Create Project
            </h2>

            <div className="mt-4 space-y-4">
                <div>
                    <label className="mb-1 block text-sm text-slate-400">
                        Project Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        placeholder="e.g. Production Infrastructure"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm text-slate-400">
                        Description
                    </label>

                    <textarea
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        placeholder="Describe this project..."
                        rows={3}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-400">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Project"}
                </button>
            </div>
        </form>
    );
}