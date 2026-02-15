'use client';

import { usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    CheckSquare, 
    Users, 
    Shield, 
    Building2,
    Settings,
    Key,
    LogOut,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Role, User } from '@/types';

interface NavItem {
    label: string;
    href: string;
    icon: any;
}

export function Sidebar() {
    const page = usePage();
    const user = page.props.auth.user as User;
    const [isCollapsed, setIsCollapsed] = useState(false);

    const userNavItems: NavItem[] = [
        { label: 'Dashboard', href: route('employee.dashboard'), icon: LayoutDashboard },
        { label: 'My Tasks', href: route('todos.index'), icon: CheckSquare },
    ];

    const managerNavItems: NavItem[] = [
        { label: 'Dashboard', href: route('manager.dashboard'), icon: LayoutDashboard },
        { label: 'Team Tasks', href: route('todos.index'), icon: CheckSquare },
        { label: 'Team Members', href: route('manager.team'), icon: Users },
    ];

    const adminNavItems: NavItem[] = [
        { label: 'Admin Dashboard', href: route('admin.dashboard'), icon: Shield },
        { label: 'User Management', href: route('admin.user-management.index'), icon: Users },
        { label: 'Departments', href: route('admin.departments.index'), icon: Building2 },
        { label: 'Roles', href: route('admin.roles.index'), icon: Key },
    ];

    const settingsNavItems: NavItem[] = [
        { label: 'Profile', href: route('profile.edit'), icon: Settings },
    ];

    const navItems = user?.roles?.some((r: Role) => r.slug === 'admin')
        ? [...adminNavItems]
        : user?.roles?.some((r: Role) => r.slug === 'manager')
        ? [...managerNavItems, ...settingsNavItems]
        : [...userNavItems, ...settingsNavItems];

    const { post } = useForm();

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('logout'));
    };

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen bg-[#0f0f10] border-r border-slate-800/50 transition-all duration-300',
                isCollapsed ? 'w-16' : 'w-64'
            )}
        >
            <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
                    {!isCollapsed && (
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                                <LayoutDashboard className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-sm font-semibold text-white">App</h1>
                                <p className="text-xs text-slate-400">
                                    {user?.roles?.some((r: Role) => r.slug === 'admin') ? 'Admin' : 'User'}
                                </p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-5 w-5" />
                        ) : (
                            <ChevronLeft className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-2">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = page.url === item.href;
                            const Icon = item.icon;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                            isActive
                                                ? 'bg-indigo-600/20 text-indigo-400'
                                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white',
                                            isCollapsed && 'justify-center'
                                        )}
                                        title={isCollapsed ? item.label : undefined}
                                    >
                                        <Icon className="h-5 w-5 flex-shrink-0" />
                                        {!isCollapsed && <span>{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Info & Logout */}
                <div className="border-t border-slate-800/50 p-4">
                    {!isCollapsed && (
                        <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-900/50 p-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                                <span className="text-sm font-semibold text-white">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-medium text-white">
                                    {user?.name}
                                </p>
                                <p className="truncate text-xs text-slate-400">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleLogout}>
                        <button
                            type="submit"
                            className={cn(
                                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400',
                                isCollapsed && 'justify-center'
                            )}
                            title={isCollapsed ? 'Logout' : undefined}
                        >
                            <LogOut className="h-5 w-5 flex-shrink-0" />
                            {!isCollapsed && <span>Logout</span>}
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
}
