import {
    Activity,
    Bell,
    Bot,
    Cloud,
    LayoutDashboard,
    Settings,
} from "lucide-react";

import { NavLink, Outlet } from "react-router-dom";

import NotificationBell from "../components/NotificationBell";

const navigation = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Infrastructure",
        path: "/infrastructure",
        icon: Cloud,
    },
    {
        name: "Monitoring",
        path: "/monitoring",
        icon: Activity,
    },
    {
        name: "AI Assistant",
        path: "/assistant",
        icon: Bot,
    },
    {
        name: "Alerts",
        path: "/alerts",
        icon: Bell,
    },
    {
        name: "Settings",
        path: "/settings",
        icon: Settings,
    },
];

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="w-64 border-r border-slate-800 bg-slate-900/80">
                    <div className="flex h-16 items-center border-b border-slate-800 px-6">
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">
                                OpsMind <span className="text-cyan-400">AI</span>
                            </h1>
                            <p className="text-xs text-slate-500">Operations Intelligence</p>
                        </div>
                    </div>

                    <nav className="space-y-1 p-4">
                        {navigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive
                                            ? "bg-cyan-500/10 text-cyan-400"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                                        }`
                                    }
                                >
                                    <Icon size={18} />
                                    {item.name}
                                </NavLink>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main area */}
                <div className="flex min-w-0 flex-1 flex-col">
                    {/* Topbar */}
                    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6">
                        <div>
                            <h2 className="text-sm font-medium text-slate-200">
                                Operations Dashboard
                            </h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <NotificationBell
                                projectId="6abce52c2c9eff2244903b3a"
                            />

                            <div>
                                <p className="text-sm font-medium">
                                    Bilal Ahmed
                                </p>

                                <p className="text-xs text-slate-500">
                                    Administrator
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="flex-1 overflow-auto p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}