import type { Task, TaskStats, TaskStatus, TaskPriority, TaskType } from '@/types/Task';
import type { User } from '@/types/User';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Plus, ClipboardList, Clock, CheckCircle, AlertTriangle, 
    Filter, Edit, Trash2, Eye, ChevronDown, Users, Search
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import UserAvatar from '@/Components/UserAvatar';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { usePermissions } from '@/hooks/usePermissions';

interface Props {
    tasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    employees: User[];
    stats: TaskStats;
    filters: { status_id?: string; priority_id?: string; type_id?: string; assigned_to?: string; search?: string };
    statuses: TaskStatus[];
    priorities: TaskPriority[];
    types: TaskType[];
}

export default function ManagerTasksIndex({ tasks, employees, stats, filters, statuses, priorities, types }: Props) {
    const { hasPermission } = usePermissions();
    console.log('Task data:', tasks.data.map(t => ({ 
    id: t.id, 
    title: t.title, 
    assigner: t.assigner 
})));
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status_id || '');
    const [priorityFilter, setPriorityFilter] = useState(filters.priority_id || '');
    const [typeFilter, setTypeFilter] = useState(filters.type_id || '');
    const [employeeFilter, setEmployeeFilter] = useState(filters.assigned_to || '');

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        router.get(route('tasks.index'), {
            search: value,
            status_id: statusFilter || undefined,
            priority_id: priorityFilter || undefined,
            type_id: typeFilter || undefined,
            assigned_to: employeeFilter || undefined,
        }, { preserveState: true, replace: true });
    };

    const applyFilters = () => {
        router.get(route('tasks.index'), {
            search: searchQuery || undefined,
            status_id: statusFilter || undefined,
            priority_id: priorityFilter || undefined,
            type_id: typeFilter || undefined,
            assigned_to: employeeFilter || undefined,
        }, { preserveState: true });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
            case 'in_progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
            case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/30';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
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
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white tracking-tight">Task Management</h2>
                </div>
            }
        >
            <Head title="Task Management" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-500/10">
                                        <ClipboardList className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                                        <p className="text-xs text-slate-400">Total Tasks</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Keep other stats cards here... */}
                         <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-yellow-500/10">
                                        <Clock className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{stats.pending}</p>
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
                                        <p className="text-2xl font-bold text-white">{stats.in_progress}</p>
                                        <p className="text-xs text-slate-400">In Progress</p>
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
                                        <p className="text-2xl font-bold text-white">{stats.completed}</p>
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
                                        <p className="text-2xl font-bold text-white">{stats.high_priority}</p>
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

                                <div className="flex-1 min-w-[200px]">
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

                                <div className="flex-1 min-w-[200px]">
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

                                <div className="flex-1 min-w-[200px]">
                                    <label className="text-xs text-slate-400 mb-1 block">Employee</label>
                                    <select
                                        value={employeeFilter}
                                        onChange={(e) => setEmployeeFilter(e.target.value)}
                                        className="w-full bg-slate-900/50 border-slate-800 text-slate-200 rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="">All Employees</option>
                                        {employees.map((emp) => (
                                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <Button onClick={applyFilters} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                                    <Filter className="w-4 h-4" />
                                    Apply Filters
                                </Button>
                                {hasPermission('create.tasks') && (
                                    <Button onClick={() => router.get(route('tasks.create'))} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                                        <Plus className="w-4 h-4" />
                                        Assign New Task
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tasks Table */}
                    <Card className="bg-[#0f0f10] border-slate-800/50">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-white">Assigned Tasks ({tasks.total})</CardTitle>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search tasks..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-9 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 w-64"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {tasks.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <ClipboardList className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                                    <p className="text-slate-500">{searchQuery ? 'No tasks found' : 'No tasks found'}</p>
                                    {searchQuery && <p className="text-slate-600 text-sm mt-1">Try a different search term</p>}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-800">
                                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Task</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Assigned By</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Assigned To</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Priority</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Type</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Due Date</th>
                                                <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
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
                                                        </div>
                                                    </td>
                                                    
                                                    <td><span className="text-slate-300">{task.assigner?.name}</span></td>
                                                    
                                                    {/* UPDATED ASSIGNED TO COLUMN */}
                                                    <td className="py-3 px-4">
                                                        {task.group_id ? (
                                                            // GROUP TASK: Show dropdown
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button className="flex items-center gap-2 hover:bg-slate-700/50 p-1 rounded transition-colors">
                                                                        {/* Fix: Check if assignee exists before rendering avatar */}
                                                                        {task.assignee && (
                                                                            <>
                                                                                <UserAvatar user={task.assignee} size="sm" />
                                                                                <span className="text-slate-300">{task.assignee.name}</span>
                                                                            </>
                                                                        )}
                                                                        <span className="text-xs text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                                            <Users className="w-3 h-3" />
                                                                            +{task.other_group_assignees?.length || 0}
                                                                        </span>
                                                                        <ChevronDown className="w-4 h-4 text-slate-500" />
                                                                    </button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="start" className="bg-slate-900 border-slate-800 text-slate-200 w-56">
                                                                    <DropdownMenuLabel>All Assignees</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator className="bg-slate-800" />
                                                                    
                                                                    {/* Other Assignees */}
                                                                    {task.other_group_assignees?.map((t) => (
                                                                        <DropdownMenuItem key={t.id} className="flex items-center gap-2 focus:bg-slate-800 cursor-pointer">
                                                                            {/* Fix: Check existence of nested assignee */}
                                                                            {t.assignee && <UserAvatar user={t.assignee} size="sm" />}
                                                                            <span>{t.assignee?.name || 'Unknown'}</span>
                                                                        </DropdownMenuItem>
                                                                    ))}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        ) : (
                                                            // INDIVIDUAL TASK: Show simple avatar
                                                            task.assignee && (
                                                                <div className="flex items-center gap-2">
                                                                    <UserAvatar user={task.assignee} size="sm" />
                                                                    <span className="text-slate-300">{task.assignee.name}</span>
                                                                </div>
                                                            )
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
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button variant="ghost" size="icon" onClick={() => router.get(route('tasks.show', task.id))} className="text-slate-400 hover:text-white hover:bg-slate-800">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => router.get(route('tasks.edit', task.id))} className="text-slate-400 hover:text-white hover:bg-slate-800">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => { if(confirm('Delete?')) router.delete(route('tasks.destroy', task.id)); }} className="text-red-400 hover:text-red-300 hover:bg-slate-800">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

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
                                            onClick={() => router.get(route('tasks.index'), {
                                                page: tasks.current_page - 1,
                                                search: searchQuery || undefined,
                                                status_id: statusFilter || undefined,
                                                priority_id: priorityFilter || undefined,
                                                type_id: typeFilter || undefined,
                                                assigned_to: employeeFilter || undefined,
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
                                            onClick={() => router.get(route('tasks.index'), {
                                                page: tasks.current_page + 1,
                                                search: searchQuery || undefined,
                                                status_id: statusFilter || undefined,
                                                priority_id: priorityFilter || undefined,
                                                type_id: typeFilter || undefined,
                                                assigned_to: employeeFilter || undefined,
                                            })}
                                            disabled={tasks.current_page === tasks.last_page}
                                            className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}