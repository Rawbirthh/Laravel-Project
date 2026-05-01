import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { CheckSquare, Clock, TrendingUp, Users, Search, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';
import type { Task, TaskStats } from '@/types/Task';
import { useState, useEffect } from 'react';

interface Props {
    taskStats: TaskStats;
    assignedTaskStats: TaskStats;
    recentTasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    assignedTasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

export default function EmployeeDashboard({ taskStats, assignedTaskStats, recentTasks, assignedTasks }: Props) {
    const [receivedSearch, setReceivedSearch] = useState('');
    const [assignedSearch, setAssignedSearch] = useState('');
    const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

    const handleSearch = (type: 'received' | 'assigned', value: string) => {
        if (type === 'received') {
            setReceivedSearch(value);
        } else {
            setAssignedSearch(value);
        }

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
            router.get(route('employee.dashboard'), {
                received_search: type === 'received' ? value : receivedSearch,
                assigned_search: type === 'assigned' ? value : assignedSearch,
            }, { preserveState: true });
        }, 500);

        setDebounceTimer(timer);
    };

    const clearReceivedSearch = () => {
        setReceivedSearch('');
        router.get(route('employee.dashboard'), {
            assigned_search: assignedSearch || undefined,
        }, { preserveState: true });
    };

    const clearAssignedSearch = () => {
        setAssignedSearch('');
        router.get(route('employee.dashboard'), {
            received_search: receivedSearch || undefined,
        }, { preserveState: true });
    };

    useEffect(() => {
        return () => {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
        };
    }, [debounceTimer]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        Employee Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Employee Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Side - Recent Assigned Tasks */}
                        <div className="space-y-4">
                            {/* Stats Row 1 */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-[#0f0f10] border-slate-800/50">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-indigo-500/10">
                                                <CheckSquare className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">{taskStats.total}</p>
                                                <p className="text-xs text-slate-400">Total Received</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-[#0f0f10] border-slate-800/50">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-amber-500/10">
                                                <Clock className="w-5 h-5 text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">{taskStats.pending}</p>
                                                <p className="text-xs text-slate-400">Pending</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Stats Row 2 */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-[#0f0f10] border-slate-800/50">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-blue-500/10">
                                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">{taskStats.in_progress}</p>
                                                <p className="text-xs text-slate-400">In Progress</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-[#0f0f10] border-slate-800/50">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                                <CheckSquare className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">{taskStats.completed}</p>
                                                <p className="text-xs text-slate-400">Completed</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Task List */}
                            <Card className="bg-[#0f0f10] border-slate-800/50">
                                <CardHeader>
                                    <CardTitle className="text-white">Recent Assigned Tasks ({recentTasks.total})</CardTitle>
                                    <div className="relative mt-2">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search tasks..."
                                            value={receivedSearch}
                                            onChange={(e) => handleSearch('received', e.target.value)}
                                            className="pl-9 pr-8 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50"
                                        />
                                        {receivedSearch && (
                                            <button
                                                onClick={clearReceivedSearch}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {recentTasks.data.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                                                <CheckSquare className="w-8 h-8 text-slate-600" />
                                            </div>
                                            <p className="text-slate-500 text-lg">No tasks assigned yet</p>
                                            <p className="text-slate-600 text-sm mt-1">Tasks will appear here when your manager assigns them</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-3">
                                                {recentTasks.data.map((task) => {
                                                    const isGroupTask = !!task.group_id;
                                                    const otherNames = task.other_group_assignees
                                                        ?.map(t => t.assignee?.name)
                                                        .filter(Boolean) || [];
                                                    
                                                    return (
                                                        <div
                                                            key={task.id}
                                                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-colors"
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-slate-200 truncate">
                                                                    {task.title}
                                                                </p>
                                                                
                                                                <div className="flex flex-col gap-1 mt-1">
                                                                    <div className="flex items-center gap-2">
                                                                        {task.assigner && (
                                                                            <span className="text-xs text-slate-500">
                                                                                From: {task.assigner.name}
                                                                            </span>
                                                                        )}
                                                                        <span className={cn(
                                                                            "px-1.5 py-0.5 rounded text-xs font-medium border capitalize",
                                                                            task.task_status?.name?.toLowerCase() === 'pending' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' :
                                                                            task.task_status?.name?.toLowerCase() === 'in progress' ? 'text-blue-400 bg-blue-400/10 border-blue-400/30' :
                                                                            'text-green-400 bg-green-400/10 border-green-400/30'
                                                                        )}>
                                                                            {task.task_status?.name || 'Unknown'}
                                                                        </span>
                                                                    </div>

                                                                    {isGroupTask && otherNames.length > 0 && (
                                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                                            <Users className="w-3 h-3 text-indigo-400" />
                                                                            <span>
                                                                                Group with: <span className="text-slate-300 font-medium">{otherNames.join(', ')}</span>
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="text-xs text-slate-500 shrink-0">
                                                                {new Date(task.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {recentTasks.last_page > 1 && (
                                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                                                    <div className="text-sm text-slate-400">
                                                        Showing {recentTasks.from} to {recentTasks.to} of {recentTasks.total}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.get(route('employee.dashboard', { page: recentTasks.current_page - 1, received_search: receivedSearch || undefined, assigned_search: assignedSearch || undefined }), { preserveState: true })}
                                                            disabled={recentTasks.current_page === 1}
                                                            className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                                        >
                                                            Previous
                                                        </Button>
                                                        <span className="text-sm text-slate-400">
                                                            Page {recentTasks.current_page} of {recentTasks.last_page}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.get(route('employee.dashboard', { page: recentTasks.current_page + 1, received_search: receivedSearch || undefined, assigned_search: assignedSearch || undefined }), { preserveState: true })}
                                                            disabled={recentTasks.current_page === recentTasks.last_page}
                                                            className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
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

                        {/* Right Side - Tasks Assigned to Coworkers */}
                        <div className="space-y-4">
                            {/* Stats Row 1 */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-[#0f0f10] border-slate-800/50">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-indigo-500/10">
                                                <Users className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">{assignedTaskStats.total}</p>
                                                <p className="text-xs text-slate-400">Total Assigned</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-[#0f0f10] border-slate-800/50">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-amber-500/10">
                                                <Clock className="w-5 h-5 text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">{assignedTaskStats.pending}</p>
                                                <p className="text-xs text-slate-400">Pending</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Stats Row 2 */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-[#0f0f10] border-slate-800/50">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-blue-500/10">
                                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">{assignedTaskStats.in_progress}</p>
                                                <p className="text-xs text-slate-400">In Progress</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-[#0f0f10] border-slate-800/50">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                                <CheckSquare className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">{assignedTaskStats.completed}</p>
                                                <p className="text-xs text-slate-400">Completed</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Task List */}
                            <Card className="bg-[#0f0f10] border-slate-800/50">
                                <CardHeader>
                                    <CardTitle className="text-white">Tasks Assigned to Coworkers ({assignedTasks.total})</CardTitle>
                                    <div className="relative mt-2">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search tasks..."
                                            value={assignedSearch}
                                            onChange={(e) => handleSearch('assigned', e.target.value)}
                                            className="pl-9 pr-8 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50"
                                        />
                                        {assignedSearch && (
                                            <button
                                                onClick={clearAssignedSearch}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {assignedTasks.data.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                                                <Users className="w-8 h-8 text-slate-600" />
                                            </div>
                                            <p className="text-slate-500 text-lg">No tasks assigned to coworkers</p>
                                            <p className="text-slate-600 text-sm mt-1">Tasks you assign to coworkers will appear here</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-3">
                                                {assignedTasks.data.map((task) => {
                                                    const isGroupTask = !!task.group_id;
                                                    const otherNames = task.other_group_assignees
                                                        ?.map(t => t.assignee?.name)
                                                        .filter(Boolean) || [];
                                                    
                                                    return (
                                                        <div
                                                            key={task.id}
                                                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-colors"
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-slate-200 truncate">
                                                                    {task.title}
                                                                </p>
                                                                
                                                                <div className="flex flex-col gap-1 mt-1">
                                                                    <div className="flex items-center gap-2">
                                                                        {task.assignee && (
                                                                            <span className="text-xs text-slate-500">
                                                                                To: {task.assignee.name}
                                                                            </span>
                                                                        )}
                                                                        <span className={cn(
                                                                            "px-1.5 py-0.5 rounded text-xs font-medium border capitalize",
                                                                            task.task_status?.name?.toLowerCase() === 'pending' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' :
                                                                            task.task_status?.name?.toLowerCase() === 'in progress' ? 'text-blue-400 bg-blue-400/10 border-blue-400/30' :
                                                                            'text-green-400 bg-green-400/10 border-green-400/30'
                                                                        )}>
                                                                            {task.task_status?.name || 'Unknown'}
                                                                        </span>
                                                                    </div>

                                                                    {isGroupTask && otherNames.length > 0 && (
                                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                                            <Users className="w-3 h-3 text-indigo-400" />
                                                                            <span>
                                                                                Group with: <span className="text-slate-300 font-medium">{otherNames.join(', ')}</span>
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="text-xs text-slate-500 shrink-0">
                                                                {new Date(task.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {assignedTasks.last_page > 1 && (
                                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                                                    <div className="text-sm text-slate-400">
                                                        Showing {assignedTasks.from} to {assignedTasks.to} of {assignedTasks.total}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.get(route('employee.dashboard', { page: assignedTasks.current_page - 1, received_search: receivedSearch || undefined, assigned_search: assignedSearch || undefined }), { preserveState: true })}
                                                            disabled={assignedTasks.current_page === 1}
                                                            className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                                        >
                                                            Previous
                                                        </Button>
                                                        <span className="text-sm text-slate-400">
                                                            Page {assignedTasks.current_page} of {assignedTasks.last_page}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.get(route('employee.dashboard', { page: assignedTasks.current_page + 1, received_search: receivedSearch || undefined, assigned_search: assignedSearch || undefined }), { preserveState: true })}
                                                            disabled={assignedTasks.current_page === assignedTasks.last_page}
                                                            className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
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
            </div>
        </AuthenticatedLayout>
    );
}