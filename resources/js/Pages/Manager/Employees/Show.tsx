import type { EmployeeTaskStats, Task, TaskStatus, TaskPriority, TaskType } from '@/types/Task';
import type { User } from '@/types/User';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    ArrowLeft, ClipboardList, Clock, CheckCircle, AlertTriangle, 
    Filter, Search, Users, FileText, Calendar, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Dialog, DialogContent } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import UserAvatar from '@/Components/UserAvatar';
import { cn } from '@/lib/utils';

interface Props {
    employee: User & { roles: { id: number; name: string }[]; departments?: { id: number; name: string }[] };
    taskStats: EmployeeTaskStats;
    tasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    statuses: TaskStatus[];
    priorities: TaskPriority[];
    types: TaskType[];
    filters: {
        status_id: string;
        priority_id: string;
        type_id: string;
        task_type: string;
        search: string;
    };
}

export default function EmployeeShow({ employee, taskStats, tasks, statuses, priorities, types, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search);
    const [statusFilter, setStatusFilter] = useState(filters.status_id);
    const [priorityFilter, setPriorityFilter] = useState(filters.priority_id);
    const [typeFilter, setTypeFilter] = useState(filters.type_id);
    const [taskTypeFilter, setTaskTypeFilter] = useState(filters.task_type);
    const [showPhoto, setShowPhoto] = useState(false);

    const applyFilters = () => {
        router.get(route('manager.employees.show', employee.id), {
            search: searchQuery || undefined,
            status_id: statusFilter || undefined,
            priority_id: priorityFilter || undefined,
            type_id: typeFilter || undefined,
            task_type: taskTypeFilter || undefined,
        }, { preserveState: true });
    };

    const getStatusColor = (status: string) => {
        const normalized = status.toLowerCase().replace(/\s+/g, '_');
        switch (normalized) {
            case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
            case 'in_progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
            case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/30';
            case 'for_review': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
        }
    };

    const getPriorityColor = (priority: string) => {
        const normalized = priority.toLowerCase().replace(/\s+/g, '_');
        switch (normalized) {
            case 'high': return 'text-red-400 bg-red-400/10 border-red-400/30';
            case 'medium': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
            case 'low': return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
        }
    };

    const formatDate = (date: string | undefined) => {
        if (!date) return 'No due date';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.get(route('manager.dashboard'))}
                        className="text-slate-400 hover:text-white hover:bg-slate-800/50"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h2 className="text-xl font-semibold text-white tracking-tight">Employee Details</h2>
                </div>
            }
        >
            <Head title={`${employee.name} - Employee Details`} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Employee Info Card */}
                    <Card className="bg-[#0f0f10] border-slate-800/50 mb-6">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-6">
                                <button
                                    type="button"
                                    onClick={() => employee.profile_picture_url && setShowPhoto(true)}
                                    className="w-28 h-28 rounded-full overflow-hidden ring-2 ring-slate-700 flex-shrink-0 hover:ring-indigo-500/50 transition-all cursor-pointer"
                                >
                                    <UserAvatar user={employee} size="xl" className="w-full h-full" />
                                </button>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{employee.name}</h3>
                                    <p className="text-sm text-slate-400">{employee.email}</p>
                                    {employee.bio && (
                                        <p className="text-sm text-slate-300 mt-2 max-w-md italic">
                                            {employee.bio}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3 mt-2">
                                        {employee.roles && employee.roles.length > 0 ? (
                                            employee.roles.map((role) => (
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
                                        {employee.departments && employee.departments.length > 0 && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                                {employee.departments[0].name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Task Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-500/10">
                                        <ClipboardList className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{taskStats.total}</p>
                                        <p className="text-xs text-slate-400">Total Tasks</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-yellow-500/10">
                                        <Clock className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{taskStats.pending}</p>
                                        <p className="text-xs text-slate-400">Pending</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10">
                                        <Clock className="w-5 h-5 text-blue-400" />
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
                                    <div className="p-2 rounded-lg bg-amber-500/10">
                                        <Clock className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{taskStats.for_review}</p>
                                        <p className="text-xs text-slate-400">For Review</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-500/10">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{taskStats.completed}</p>
                                        <p className="text-xs text-slate-400">Completed</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-red-500/10">
                                        <AlertTriangle className="w-5 h-5 text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{taskStats.high_priority}</p>
                                        <p className="text-xs text-slate-400">High Priority</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="bg-[#0f0f10] border-slate-800/50 mb-6">
                        <CardContent className="pt-4">
                            <div className="flex flex-wrap gap-4 items-end">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="text-xs text-slate-400 mb-1 block">Search</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search tasks..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 w-full"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <label className="text-xs text-slate-400 mb-1 block">Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full bg-slate-900/50 border-slate-800 text-slate-200 rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="">All Statuses</option>
                                        {statuses.map((status) => (
                                            <option key={status.id} value={status.id.toString()}>{status.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <label className="text-xs text-slate-400 mb-1 block">Priority</label>
                                    <select
                                        value={priorityFilter}
                                        onChange={(e) => setPriorityFilter(e.target.value)}
                                        className="w-full bg-slate-900/50 border-slate-800 text-slate-200 rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="">All Priorities</option>
                                        {priorities.map((priority) => (
                                            <option key={priority.id} value={priority.id.toString()}>{priority.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <label className="text-xs text-slate-400 mb-1 block">Type</label>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="w-full bg-slate-900/50 border-slate-800 text-slate-200 rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="">All Types</option>
                                        {types.map((type) => (
                                            <option key={type.id} value={type.id.toString()}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <label className="text-xs text-slate-400 mb-1 block">Task Type</label>
                                    <select
                                        value={taskTypeFilter}
                                        onChange={(e) => setTaskTypeFilter(e.target.value)}
                                        className="w-full bg-slate-900/50 border-slate-800 text-slate-200 rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="">All</option>
                                        <option value="individual">Individual</option>
                                        <option value="group">Group</option>
                                    </select>
                                </div>
                                <Button onClick={applyFilters} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                                    <Filter className="w-4 h-4" />
                                    Apply Filters
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tasks Table */}
                    <Card className="bg-[#0f0f10] border-slate-800/50">
                        <CardHeader>
                            <CardTitle className="text-white">Tasks ({tasks.total})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {tasks.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <ClipboardList className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                                    <p className="text-slate-500">{searchQuery ? 'No tasks found' : 'No tasks assigned to this employee'}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-800">
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Task</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Assigned By</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Priority</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Type</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Due Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tasks.data.map((task) => (
                                                    <tr key={task.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                                                        <td className="py-3 px-4">
                                                            <div>
                                                                <p className="font-medium text-slate-200">{task.title}</p>
                                                                {task.description && (
                                                                    <p className="text-xs text-slate-500 truncate max-w-xs">{task.description}</p>
                                                                )}
                                                                {task.group_id && (
                                                                    <span className="inline-flex items-center gap-1 text-xs text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded mt-1">
                                                                        <Users className="w-3 h-3" />
                                                                        Group Task
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            {task.assigner && (
                                                                <div className="flex items-center gap-2">
                                                                    <UserAvatar user={task.assigner} size="sm" />
                                                                    <span className="text-slate-300">{task.assigner.name}</span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className={cn(
                                                                "px-2 py-1 rounded text-xs font-medium border",
                                                                getStatusColor(task.task_status?.name || '')
                                                            )}>
                                                                {task.task_status?.name || 'Unknown'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className={cn(
                                                                "px-2 py-1 rounded text-xs font-medium border",
                                                                getPriorityColor(task.task_priority?.name || '')
                                                            )}>
                                                                {task.task_priority?.name || 'Unknown'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className="text-slate-400 text-sm">
                                                                {task.task_type?.name || 'Unknown'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className="text-slate-400 text-sm">
                                                                {formatDate(task.due_date)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {tasks.last_page > 1 && (
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                                            <div className="text-sm text-slate-400">
                                                Showing {tasks.from} to {tasks.to} of {tasks.total} tasks
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.get(route('manager.employees.show', employee.id), {
                                                        page: tasks.current_page - 1,
                                                        search: searchQuery || undefined,
                                                        status_id: statusFilter || undefined,
                                                        priority_id: priorityFilter || undefined,
                                                        type_id: typeFilter || undefined,
                                                        task_type: taskTypeFilter || undefined,
                                                    })}
                                                    disabled={tasks.current_page === 1}
                                                    className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                                >
                                                    Previous
                                                </Button>
                                                <span className="text-sm text-slate-400">
                                                    Page {tasks.current_page} of {tasks.last_page}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.get(route('manager.employees.show', employee.id), {
                                                        page: tasks.current_page + 1,
                                                        search: searchQuery || undefined,
                                                        status_id: statusFilter || undefined,
                                                        priority_id: priorityFilter || undefined,
                                                        type_id: typeFilter || undefined,
                                                        task_type: taskTypeFilter || undefined,
                                                    })}
                                                    disabled={tasks.current_page === tasks.last_page}
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

            {/* Photo Preview Modal */}
            <Dialog open={showPhoto} onOpenChange={setShowPhoto}>
                <DialogContent className="max-w-lg bg-transparent border-none shadow-none">
                    <button
                        onClick={() => setShowPhoto(false)}
                        className="absolute -top-10 right-0 text-white/80 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    {employee.profile_picture_url && (
                        <img
                            src={employee.profile_picture_url}
                            alt={employee.name}
                            className="w-full rounded-lg"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}