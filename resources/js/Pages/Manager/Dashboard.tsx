import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { CheckSquare, TrendingUp, Shield, ClipboardList, Plus, Clock, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import UserAvatar from '@/Components/UserAvatar';
import { cn } from '@/lib/utils';
import { PaginatedResponse, SearchFilter } from '@/types/index';
import type { Task, TaskStats } from '@/types/Task';
import type { User } from '@/types/User';
import { usePermissions } from '@/hooks/usePermissions';

interface Props {
    stats: { employees: number };
    taskStats: TaskStats;
    users: PaginatedResponse<User>;
    recentTasks: PaginatedResponse<Task>;
    filters: {
        team_search: string;
        task_search: string;
    };
}

export default function ManagerDashboard({ stats, taskStats, users, recentTasks, filters }: Props) {
    const { hasPermission } = usePermissions();
    
    const [teamSearchQuery, setTeamSearchQuery] = useState(filters.team_search);
    const [taskSearchQuery, setTaskSearchQuery] = useState(filters.task_search);

    const handleTeamSearch = (value: string) => {
        setTeamSearchQuery(value);
        router.get(route('manager.dashboard'), { 
            team_search: value,
            task_search: taskSearchQuery,
            team_page: 1
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleTaskSearch = (value: string) => {
        setTaskSearchQuery(value);
        router.get(route('manager.dashboard'), { 
            team_search: teamSearchQuery,
            task_search: value,
            task_page: 1
        }, {
            preserveState: true,
            replace: true,
        });
    };
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
                            onClick={() => router.get(route('tasks.index'))}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
                        >
                            <ClipboardList className="w-4 h-4" />
                            Task Management
                        </Button>
                        {hasPermission('create.tasks') && (
                            <Button
                                onClick={() => router.get(route('tasks.create'))}
                                variant="outline"
                                className="border-slate-700 text-slate-300 gap-2 bg-[#0f0f10]"
                            >
                                <Plus className="w-4 h-4" />
                                Assign New Task
                            </Button>
                        )}
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
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white">Team Overview ({users.total})</CardTitle>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search team..."
                                            value={teamSearchQuery}
                                            onChange={(e) => handleTeamSearch(e.target.value)}
                                            className="pl-9 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 w-48"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {users.data.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500">{teamSearchQuery ? 'No team members found' : 'No team members yet'}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            {users.data.map((teamUser) => (
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

                                        {/* Team Pagination */}
                                        {users.last_page > 1 && (
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                                                <div className="text-xs text-slate-400">
                                                    {users.from}-{users.to} of {users.total}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.get(route('manager.dashboard'), { 
                                                            team_page: users.current_page - 1,
                                                            task_page: recentTasks.current_page,
                                                            team_search: teamSearchQuery,
                                                            task_search: taskSearchQuery
                                                        })}
                                                        disabled={users.current_page === 1}
                                                        className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white h-7 text-xs"
                                                    >
                                                        Prev
                                                    </Button>
                                                    <span className="text-xs text-slate-400">
                                                        {users.current_page}/{users.last_page}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.get(route('manager.dashboard'), { 
                                                            team_page: users.current_page + 1,
                                                            task_page: recentTasks.current_page,
                                                            team_search: teamSearchQuery,
                                                            task_search: taskSearchQuery
                                                        })}
                                                        disabled={users.current_page === users.last_page}
                                                        className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white h-7 text-xs"
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white">Recent Assigned Tasks ({recentTasks.total})</CardTitle>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search tasks..."
                                            value={taskSearchQuery}
                                            onChange={(e) => handleTaskSearch(e.target.value)}
                                            className="pl-9 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 w-48"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {recentTasks.data.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500">{taskSearchQuery ? 'No tasks found' : 'No recent tasks'}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            {recentTasks.data.map((task) => (
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
                                                            task.status_id === 1 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' :
                                                            task.status_id === 2 ? 'text-blue-400 bg-blue-400/10 border-blue-400/30' :
                                                            'text-green-400 bg-green-400/10 border-green-400/30'
                                                        )}>
                                                            {task.task_status?.name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-500 shrink-0">
                                                    {new Date(task.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            ))}
                                        </div>

                                        {/* Task Pagination */}
                                        {recentTasks.last_page > 1 && (
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                                                <div className="text-xs text-slate-400">
                                                    {recentTasks.from}-{recentTasks.to} of {recentTasks.total}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.get(route('manager.dashboard'), { 
                                                            team_page: users.current_page,
                                                            task_page: recentTasks.current_page - 1,
                                                            team_search: teamSearchQuery,
                                                            task_search: taskSearchQuery
                                                        })}
                                                        disabled={recentTasks.current_page === 1}
                                                        className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white h-7 text-xs"
                                                    >
                                                        Prev
                                                    </Button>
                                                    <span className="text-xs text-slate-400">
                                                        {recentTasks.current_page}/{recentTasks.last_page}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.get(route('manager.dashboard'), { 
                                                            team_page: users.current_page,
                                                            task_page: recentTasks.current_page + 1,
                                                            team_search: teamSearchQuery,
                                                            task_search: taskSearchQuery
                                                        })}
                                                        disabled={recentTasks.current_page === recentTasks.last_page}
                                                        className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white h-7 text-xs"
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
