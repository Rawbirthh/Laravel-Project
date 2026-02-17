import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { CheckSquare, TrendingUp, Shield, ClipboardList, Plus, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/Components/ui/button';
import UserAvatar from '@/Components/UserAvatar';
import { cn } from '@/lib/utils';
import type { Task, TaskStats } from '@/types/Task';
import type { User } from '@/types/User';

interface Props {
    stats: { employees: number };
    taskStats: TaskStats;
    users: User[];
    recentTasks: Task[];
}

export default function ManagerDashboard({ stats, taskStats, users, recentTasks }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        Manager Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Manager Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex gap-3 mb-6">
                        <Button
                            onClick={() => router.get(route('manager.tasks.index'))}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
                        >
                            <ClipboardList className="w-4 h-4" />
                            Task Management
                        </Button>
                        <Button
                            onClick={() => router.get(route('manager.tasks.create'))}
                            variant="outline"
                            className="border-slate-700 text-slate-300 gap-2 bg-[#0f0f10]"
                        >
                            <Plus className="w-4 h-4" />
                            Assign New Task
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-emerald-400" />
                                    Employees
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-white">{stats.employees}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CheckSquare className="w-5 h-5 text-amber-400" />
                                    Total Tasks
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-white">{taskStats.total}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-yellow-400" />
                                    Pending
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-white">{taskStats.pending}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-blue-400" />
                                    In Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-white">{taskStats.in_progress}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                                    Completed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-white">{taskStats.completed}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white">Team Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {users.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500">No team members yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {users.slice(0, 5).map((teamUser) => (
                                            <div
                                                key={teamUser.id}
                                                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800/50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <UserAvatar user={teamUser} size="md" />
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-200">{teamUser.name}</p>
                                                        <p className="text-xs text-slate-500">{teamUser.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 flex-wrap">
                                                    {teamUser.roles && teamUser.roles.length > 0 ? (
                                                        teamUser.roles.map((role) => (
                                                            <span
                                                                key={role.id}
                                                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                                                            >
                                                                {role.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/30">
                                                            User
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white">Recent Assigned Tasks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentTasks.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500">No recent tasks</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {recentTasks.slice(0, 5).map((task) => (
                                            <div
                                                key={task.id}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/50"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-200 truncate">
                                                        {task.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {task.assignee && (
                                                            <span className="text-xs text-slate-500">
                                                                {task.assignee.name}
                                                            </span>
                                                        )}
                                                        <span className={cn(
                                                            "px-1.5 py-0.5 rounded text-xs font-medium border capitalize",
                                                            task.status === 'pending' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' :
                                                            task.status === 'in_progress' ? 'text-blue-400 bg-blue-400/10 border-blue-400/30' :
                                                            'text-green-400 bg-green-400/10 border-green-400/30'
                                                        )}>
                                                            {task.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-500 shrink-0">
                                                    {new Date(task.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
