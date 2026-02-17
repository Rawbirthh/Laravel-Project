import type { Task, TaskStats } from '@/types/Task';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { 
    ClipboardList, Clock, CheckCircle, AlertTriangle, 
    Filter, Play, CheckSquare, Eye, Calendar, User, Users 
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { cn } from '@/lib/utils';

interface Props {
    tasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    stats: TaskStats;
    filters: { status?: string; priority?: string };
}

export default function EmployeeTasksIndex({ tasks, stats, filters }: Props) {
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [priorityFilter, setPriorityFilter] = useState(filters.priority || '');
    const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

    const applyFilters = () => {
        router.get(route('employee.tasks.index'), {
            status: statusFilter || undefined,
            priority: priorityFilter || undefined,
        }, { preserveState: true });
    };

    const handleStatusUpdate = (taskId: number, status: string) => {
        setUpdatingTaskId(taskId);
        router.put(route('employee.tasks.update-status', taskId), { status }, {
            onFinish: () => setUpdatingTaskId(null),
            preserveScroll: true,
        });
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
        const dateObj = new Date(date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (dateObj.toDateString() === today.toDateString()) return 'Today';
        if (dateObj.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        
        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const isOverdue = (dueDate: string | undefined, status: string) => {
        if (!dueDate || status === 'completed') return false;
        return new Date(dueDate) < new Date();
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-white tracking-tight">My Tasks</h2>}>
            <Head title="My Tasks" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-500/10"><ClipboardList className="w-5 h-5 text-indigo-400" /></div>
                                    <div><p className="text-2xl font-bold text-white">{stats.total}</p><p className="text-xs text-slate-400">Total Tasks</p></div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-yellow-500/10"><Clock className="w-5 h-5 text-yellow-400" /></div>
                                    <div><p className="text-2xl font-bold text-white">{stats.pending}</p><p className="text-xs text-slate-400">Pending</p></div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10"><Play className="w-5 h-5 text-blue-400" /></div>
                                    <div><p className="text-2xl font-bold text-white">{stats.in_progress}</p><p className="text-xs text-slate-400">In Progress</p></div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-500/10"><CheckCircle className="w-5 h-5 text-green-400" /></div>
                                    <div><p className="text-2xl font-bold text-white">{stats.completed}</p><p className="text-xs text-slate-400">Completed</p></div>
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
                                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-slate-900/50 border-slate-800 text-slate-200 rounded-md px-3 py-2 text-sm">
                                        <option value="">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="text-xs text-slate-400 mb-1 block">Priority</label>
                                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="w-full bg-slate-900/50 border-slate-800 text-slate-200 rounded-md px-3 py-2 text-sm">
                                        <option value="">All Priorities</option>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <Button onClick={applyFilters} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                                    <Filter className="w-4 h-4" /> Apply Filters
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tasks List */}
                    <div className="space-y-4">
                        {tasks.data.length === 0 ? (
                            <Card className="bg-[#0f0f10] border-slate-800/50">
                                <CardContent className="py-12 text-center">
                                    <ClipboardList className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                                    <p className="text-slate-500">No tasks assigned to you</p>
                                </CardContent>
                            </Card>
                        ) : (
                            tasks.data.map((task) => {
                                const overdue = isOverdue(task.due_date, task.status);
                                const isUpdating = updatingTaskId === task.id;
                                // Extract other assignee names
                                const otherAssignees = task.other_group_assignees
                                    ?.map(t => t.assignee?.name)
                                    .filter(Boolean) || [];

                                return (
                                    <Card key={task.id} className={cn("bg-[#0f0f10] border-slate-800/50 transition-all", overdue && "border-red-500/30")}>
                                        <CardContent className="pt-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-semibold text-white truncate">{task.title}</h3>
                                                        <span className={cn("px-2 py-0.5 rounded text-xs font-medium border capitalize shrink-0", getStatusColor(task.status))}>
                                                            {task.status.replace('_', ' ')}
                                                        </span>
                                                        <span className={cn("px-2 py-0.5 rounded text-xs font-medium border capitalize shrink-0", getPriorityColor(task.priority))}>
                                                            {task.priority}
                                                        </span>
                                                    </div>

                                                    {task.description && (
                                                        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{task.description}</p>
                                                    )}

                                                    <div className="flex flex-col gap-2">
                                                        {/* Standard Meta */}
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                <span className={cn(overdue && "text-red-400")}>{formatDate(task.due_date)}</span>
                                                                {overdue && <AlertTriangle className="w-4 h-4 text-red-400 ml-1" />}
                                                            </div>
                                                            {task.assigner && (
                                                                <div className="flex items-center gap-1">
                                                                    <User className="w-4 h-4" />
                                                                    <span>Assigned by {task.assigner.name}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Group Task Meta - NEW */}
                                                        {task.group_id && otherAssignees.length > 0 && (
                                                            <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/30 rounded-md px-2 py-1 w-fit">
                                                                <Users className="w-4 h-4 text-indigo-400" />
                                                                <span>
                                                                    Group task with: <span className="text-slate-200 font-medium">{otherAssignees.join(', ')}</span>
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status Actions */}
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {task.status !== 'completed' && (
                                                        <>
                                                            {task.status === 'pending' && (
                                                                <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(task.id, 'in_progress')} disabled={isUpdating} className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 gap-1">
                                                                    <Play className="w-3 h-3" /> Start
                                                                </Button>
                                                            )}
                                                            {task.status === 'in_progress' && (
                                                                <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(task.id, 'completed')} disabled={isUpdating} className="border-green-500/30 text-green-400 hover:bg-green-500/10 gap-1">
                                                                    <CheckSquare className="w-3 h-3" /> Complete
                                                                </Button>
                                                            )}
                                                        </>
                                                    )}
                                                    <Button size="sm" variant="ghost" onClick={() => router.get(route('employee.tasks.show', task.id))} className="text-slate-400 hover:text-white hover:bg-slate-800">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {tasks.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            {tasks.links.map((link, i) => (
                                <Button key={i} variant={link.active ? 'default' : 'outline'} onClick={() => link.url && router.get(link.url)} disabled={!link.url} className={cn(link.active ? 'bg-indigo-600 hover:bg-indigo-500' : 'border-slate-700 text-slate-300', 'text-sm')} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}