import { usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    CheckSquare, 
    Users, 
    Shield, 
    Building2,
    Settings,
    Key,
    Lock,
    LogOut,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { User } from '@/types';

interface NavItem {
    label: string;
    href: string;
    icon: any;
    permission?: string; // Optional permission key
}

export function Sidebar() {
    const page = usePage();
    const user = page.props.auth.user as User;
    const permissions = (page.props.auth.permissions as string[]) || [];
    
    const [isCollapsed, setIsCollapsed] = useState(false);

    const allNavItems: NavItem[] = [
        // Employee Items
        { label: 'Dashboard', href: route('employee.dashboard'), icon: LayoutDashboard, permission: 'access.employee.dashboard' },
        { label: 'My Tasks', href: route('todos.index'), icon: CheckSquare, permission: 'view_own_tasks' },
        { label: 'Team Tasks', href: route('employee.tasks.index'), icon: CheckSquare, permission: 'view.my-own.task' },

        // Manager Items
        { label: 'Manager Dashboard', href: route('manager.dashboard'), icon: LayoutDashboard, permission: 'access.manager.dashboard' },
        { label: 'Team Tasks', href: route('manager.tasks.index'), icon: CheckSquare, permission: 'view.all-employee.task' },
        { label: 'Team Members', href: route('manager.team'), icon: Users, permission: 'view.manager.team' },

        // Admin Items
        { label: 'Admin Dashboard', href: route('admin.dashboard'), icon: Shield, permission: 'access.admin.dashboard' },
        { label: 'User Management', href: route('admin.user-management.index'), icon: Users, permission: 'create.users' },
        { label: 'Departments', href: route('admin.departments.index'), icon: Building2, permission: 'create.departments' },
        { label: 'Roles', href: route('admin.roles.index'), icon: Key, permission: 'create.roles' },
        { label: 'Permissions', href: route('admin.permissions.index'), icon: Lock, permission: 'create.permissions' },

        // Settings (Visible to everyone or protected if needed)
        { label: 'Profile', href: route('profile.edit'), icon: Settings },
    ];

    // Filter items: Show if no permission is required OR if user has the permission
    const navItems = allNavItems.filter((item) => {
        if (!item.permission) return true;
        return permissions.includes(item.permission);
    });

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
                                    {/* Display highest permission level or just 'User' */}
                                    {permissions.includes('access.admin.dashboard') ? 'Admin' : 
                                     permissions.includes('access.manager.dashboard') ? 'Manager' : 'User'}
                                </p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors"
                    >
                        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-2">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = page.url === item.href;
                            const Icon = item.icon;

                            return (
                                <li key={item.href + item.label}>
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