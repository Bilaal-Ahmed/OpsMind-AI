import { useState } from "react";
import {
    Bell,
    Bot,
    Check,
    ChevronRight,
    Info,
    Palette,
    Save,
    Server,
    Shield,
    User,
} from "lucide-react";

export default function Settings() {
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [criticalAlerts, setCriticalAlerts] = useState(true);
    const [weeklySummary, setWeeklySummary] = useState(false);
    const [saved, setSaved] = useState(false);

    function handleSave() {
        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2500);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                        <Server className="h-4 w-4 text-cyan-400" />
                    </div>

                    <span className="text-xs font-medium uppercase tracking-wider text-cyan-400">
                        Platform Configuration
                    </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white">
                    Settings
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                    Configure your OpsMind AI environment and preferences.
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                {/* Main settings */}
                <div className="space-y-6 xl:col-span-2">
                    {/* Profile */}
                    <section className="rounded-xl border border-slate-800 bg-slate-900">
                        <div className="border-b border-slate-800 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                                    <User className="h-4 w-4 text-cyan-400" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-white">
                                        Profile
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Your OpsMind account information
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 p-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs font-medium text-slate-400">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value="Bilal Ahmed"
                                    readOnly
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-medium text-slate-400">
                                    Role
                                </label>

                                <input
                                    type="text"
                                    value="Administrator"
                                    readOnly
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* AI configuration */}
                    <section className="rounded-xl border border-slate-800 bg-slate-900">
                        <div className="border-b border-slate-800 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
                                    <Bot className="h-4 w-4 text-violet-400" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-white">
                                        AI Assistant
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Configure the OpsMind AI service
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 p-5">
                            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-200">
                                        AI Provider
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Provider currently used by OpsMind AI
                                    </p>
                                </div>

                                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-400">
                                    Gemini
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-200">
                                        AI Assistant
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Infrastructure analysis and operational
                                        assistance
                                    </p>
                                </div>

                                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    Operational
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Notifications */}
                    <section className="rounded-xl border border-slate-800 bg-slate-900">
                        <div className="border-b border-slate-800 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10">
                                    <Bell className="h-4 w-4 text-amber-400" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-white">
                                        Notifications
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Control operational notifications
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-800">
                            <SettingToggle
                                title="Email notifications"
                                description="Receive operational updates and alerts by email."
                                enabled={emailAlerts}
                                onChange={setEmailAlerts}
                            />

                            <SettingToggle
                                title="Critical alerts"
                                description="Notify when critical infrastructure issues are detected."
                                enabled={criticalAlerts}
                                onChange={setCriticalAlerts}
                            />

                            <SettingToggle
                                title="Weekly summary"
                                description="Receive a weekly infrastructure health summary."
                                enabled={weeklySummary}
                                onChange={setWeeklySummary}
                            />
                        </div>
                    </section>

                    {/* Appearance */}
                    <section className="rounded-xl border border-slate-800 bg-slate-900">
                        <div className="border-b border-slate-800 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                                    <Palette className="h-4 w-4 text-cyan-400" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-white">
                                        Appearance
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Customize the OpsMind interface
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center justify-between rounded-lg border border-cyan-500/30 bg-slate-950 p-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-200">
                                        Dark theme
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Optimized for operations and monitoring
                                        environments.
                                    </p>
                                </div>

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10">
                                    <Check className="h-4 w-4 text-cyan-400" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Environment */}
                    <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                                <Shield className="h-4 w-4 text-emerald-400" />
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold text-white">
                                    Environment
                                </h2>

                                <p className="text-xs text-slate-500">
                                    Current platform status
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-3">
                            <StatusRow
                                label="API"
                                value="Operational"
                            />

                            <StatusRow
                                label="Database"
                                value="Connected"
                            />

                            <StatusRow
                                label="AI Service"
                                value="Operational"
                            />

                            <StatusRow
                                label="Monitoring"
                                value="Active"
                            />
                        </div>
                    </section>

                    {/* Project */}
                    <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
                                <Info className="h-4 w-4 text-violet-400" />
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold text-white">
                                    Project Information
                                </h2>

                                <p className="text-xs text-slate-500">
                                    OpsMind deployment details
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-3">
                            <InfoRow
                                label="Project"
                                value="OpsMind AI"
                            />

                            <InfoRow
                                label="Environment"
                                value="Development"
                            />

                            <InfoRow
                                label="API"
                                value="FastAPI"
                            />

                            <InfoRow
                                label="Database"
                                value="MongoDB"
                            />
                        </div>
                    </section>

                    {/* Save */}
                    <button
                        type="button"
                        onClick={handleSave}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                    >
                        {saved ? (
                            <>
                                <Check className="h-4 w-4" />
                                Settings Saved
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Preferences
                            </>
                        )}
                    </button>

                    {/* Version */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                                OpsMind AI
                            </span>

                            <span className="text-xs font-medium text-slate-400">
                                v0.1.0
                            </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-slate-600">
                                Platform status
                            </span>

                            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Online
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom navigation hint */}
            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-5 py-4">
                <div>
                    <p className="text-sm font-medium text-slate-200">
                        Need to manage your infrastructure?
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        Access environments, resources, and services from the
                        Infrastructure section.
                    </p>
                </div>

                <a
                    href="/infrastructure"
                    className="hidden items-center gap-1 text-xs font-medium text-cyan-400 transition hover:text-cyan-300 sm:flex"
                >
                    Infrastructure
                    <ChevronRight className="h-4 w-4" />
                </a>
            </div>
        </div>
    );
}

interface SettingToggleProps {
    title: string;
    description: string;
    enabled: boolean;
    onChange: (value: boolean) => void;
}

function SettingToggle({
    title,
    description,
    enabled,
    onChange,
}: SettingToggleProps) {
    return (
        <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
                <p className="text-sm font-medium text-slate-200">
                    {title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                    {description}
                </p>
            </div>

            <button
                type="button"
                onClick={() => onChange(!enabled)}
                aria-label={`Toggle ${title}`}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${enabled ? "bg-cyan-500" : "bg-slate-700"
                    }`}
            >
                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${enabled ? "left-6" : "left-1"
                        }`}
                />
            </button>
        </div>
    );
}

function StatusRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5">
            <span className="text-xs text-slate-400">{label}</span>

            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {value}
            </span>
        </div>
    );
}

function InfoRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0">
            <span className="text-xs text-slate-500">{label}</span>

            <span className="text-xs font-medium text-slate-300">
                {value}
            </span>
        </div>
    );
}