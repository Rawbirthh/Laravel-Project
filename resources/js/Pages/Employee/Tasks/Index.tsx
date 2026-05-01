import type { Task, TaskStats, TaskStatus, TaskPriority, TaskType } from '@/types/Task';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    ClipboardList, Clock, CheckCircle, AlertTriangle, 
    Filter, Play, CheckSquare, Eye, Calendar, User, Users,Plus, X, Upload, File, AlertCircle, Download, Search, Edit, FileText
} from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { cn } from '@/lib/utils';
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
    stats: TaskStats;
    filters: { status_id?: string; priority_id?: string; type_id?: string; search?: string };
    statuses: TaskStatus[];
    priorities: TaskPriority[];
    types: TaskType[];
}

export default function EmployeeTasksIndex({ tasks, stats, filters, statuses, priorities, types }: Props) {
    const { hasPermission } = usePermissions();
    
    const [statusFilter, setStatusFilter] = useState(filters.status_id || '');
    const [priorityFilter, setPriorityFilter] = useState(filters.priority_id || '');
    const [typeFilter, setTypeFilter] = useState(filters.type_id || '');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
    const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [solution, setSolution] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [existingAttachments, setExistingAttachments] = useState<{id: number; file_name: string; file_path: string}[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        return () => {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
        };
    }, [debounceTimer]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
            router.get(route('tasks.index'), {
                search: value || undefined,
                status_id: statusFilter || undefined,
                priority_id: priorityFilter || undefined,
                type_id: typeFilter || undefined,
            }, { preserveState: true });
        }, 500);

        setDebounceTimer(timer);
    };

    const applyFilters = () => {
        router.get(route('tasks.index'), {
            search: searchQuery || undefined,
            status_id: statusFilter || undefined,
            priority_id: priorityFilter || undefined,
            type_id: typeFilter || undefined,
        }, { preserveState: true });
    };

    const clearSearch = () => {
        setSearchQuery('');
        router.get(route('tasks.index'), {
            status_id: statusFilter || undefined,
            priority_id: priorityFilter || undefined,
            type_id: typeFilter || undefined,
        }, { preserveState: true });
    };

    const handleStatusUpdate = (taskId: number, statusId: number) => {
        setUpdatingTaskId(taskId);
        router.put(route('employee.tasks.update-status', taskId), { status_id: statusId }, {
            onFinish: () => setUpdatingTaskId(null),
            preserveScroll: true,
        });
    };

    const getStatusColor = (status: string) => {
        const normalized = status.toLowerCase().replace(/\s+/g, '_');
        switch (normalized) {
            case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
            case 'in_progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
            case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/30';
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

    const handleStartTask = (taskId: number) => {
        setUpdatingTaskId(taskId);
        router.put(route('employee.tasks.update-status', taskId), { status_id: 2 }, {
            onFinish: () => setUpdatingTaskId(null),
            preserveScroll: true,
        });
    };

    const openSubmitModal = (task: Task) => {
        setSelectedTask(task);
        setSolution(task.submission?.solution_text || '');
        setAttachments([]);
        setExistingAttachments(task.submission?.attachments || []);
        setFormErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
        setSolution('');
        setAttachments([]);
        setExistingAttachments([]);
        setFormErrors({});
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(Array.from(e.target.files));
        }
    };

    const handleSubmitTask = () => {
        if (!selectedTask) return;
        
        setSubmitting(true);
        setFormErrors({});
        
        const formData = new FormData();
        formData.append('solution_text', solution);
        attachments.forEach((file, index) => {
            formData.append(`attachments[${index}]`, file);
        });

        router.post(route('employee.tasks.submit', selectedTask.id), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onError: (errors) => {
                setSubmitting(false);
                setFormErrors(errors);
            },
            onSuccess: () => {
                setSubmitting(false);
                closeModal();
            },
            preserveScroll: true,
        });
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
                                    <label className="text-xs text-slate-400 mb-1 block">Search</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search tasks..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="pl-9 pr-8 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 w-full"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={clearSearch}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="text-xs text-slate-400 mb-1 block">Status</label>
                                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-slate-900/50 border-slate-800 text-slate-200 rounded-md px-3 py-2 text-sm">
                                        <option value="">All Statuses</option>
                                        {statuses.map((status) => (
                                            <option key={status.id} value={status.id.toString()}>{status.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="text-xs text-slate-400 mb-1 block">Priority</label>
                                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="w-full bg-slate-900/50 border-slate-800 text-slate-200 rounded-md px-3 py-2 text-sm">
                                        <option value="">All Priorities</option>
                                        {priorities.map((priority) => (
                                            <option key={priority.id} value={priority.id.toString()}>{priority.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="text-xs text-slate-400 mb-1 block">Type</label>
                                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full bg-slate-900/50 border-slate-800 text-slate-200 rounded-md px-3 py-2 text-sm">
                                        <option value="">All Types</option>
                                        {types.map((type) => (
                                            <option key={type.id} value={type.id.toString()}>{type.name}</option>
                                        ))}
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
                                const overdue = isOverdue(task.due_date, task.task_status?.name || '');
                                const isUpdating = updatingTaskId === task.id;
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
                                                        <span className={cn("px-2 py-0.5 rounded text-xs font-medium border shrink-0", getStatusColor(task.task_status?.name || ''))}>
                                                            {task.task_status?.name || 'Unknown'}
                                                        </span>
                                                        <span className={cn("px-2 py-0.5 rounded text-xs font-medium border shrink-0", getPriorityColor(task.task_priority?.name || ''))}>
                                                            {task.task_priority?.name || 'Unknown'}
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

                                                        {/* Rejection Notice */}
                                                        {task.submission?.review_comment && task.task_status?.name?.toLowerCase() === 'in progress' && (
                                                            <div className="flex items-start gap-2 text-sm bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
                                                                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                                                <div>
                                                                    <p className="text-red-400 font-medium">Rejected by {task.submission.reviewer?.name || 'Manager'}</p>
                                                                    <p className="text-slate-300 mt-1">Reason: {task.submission.review_comment}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status Actions */}
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {task.task_status?.name?.toLowerCase() === 'pending' && (
                                                        <Button size="sm" onClick={() => handleStartTask(task.id)} disabled={isUpdating} className="bg-blue-600 hover:bg-blue-500 text-white gap-1">
                                                            <Play className="w-3 h-3" /> Start
                                                        </Button>
                                                    )}
                                                    {task.task_status?.name?.toLowerCase() === 'in progress' && (
                                                        <Button size="sm" onClick={() => openSubmitModal(task)} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-1">
                                                            <Edit className="w-3 h-3" /> Update Task
                                                        </Button>
                                                    )}
                                                    {task.task_status?.name?.toLowerCase() === 'for review' && (
                                                        <span className="text-sm text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-md border border-amber-500/30">
                                                            Wait for the result
                                                        </span>
                                                    )}
                                                    {task.task_status?.name?.toLowerCase() === 'completed' && (
                                                        <Button size="sm" onClick={() => openSubmitModal(task)} className="bg-slate-700 hover:bg-slate-600 text-white gap-1">
                                                            <FileText className="w-3 h-3" /> View Details
                                                        </Button>
                                                    )}
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
                                    }, { preserveState: true })}
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
                                    }, { preserveState: true })}
                                    disabled={tasks.current_page === tasks.last_page}
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Submit Task Modal */}
            <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle>
                                {selectedTask?.task_status?.name?.toLowerCase() === 'completed' ? 'View Task Details' : 'Update Task'}
                            </DialogTitle>
                            <Button size="icon" variant="ghost" onClick={closeModal} className="text-slate-400 hover:text-white hover:bg-slate-800">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <DialogDescription>
                            {selectedTask?.title}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                        {/* Solution Text */}
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-slate-300">Solution / Notes</label>
                            <Textarea
                                value={solution}
                                onChange={(e) => {
                                    setSolution(e.target.value);
                                    if (formErrors.solution_text) {
                                        setFormErrors({ ...formErrors, solution_text: '' });
                                    }
                                }}
                                rows={5}
                                placeholder="Describe your solution or add notes..."
                                disabled={selectedTask?.task_status?.name?.toLowerCase() === 'completed'}
                                className={cn(
                                    "bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20",
                                    formErrors.solution_text && "border-red-500 focus:border-red-500",
                                    selectedTask?.task_status?.name?.toLowerCase() === 'completed' && "opacity-50 cursor-not-allowed"
                                )}
                            />
                            {formErrors.solution_text && (
                                <p className="text-sm text-red-400">{formErrors.solution_text}</p>
                            )}
                        </div>

                        {/* File Upload */}
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-slate-300">Attachments</label>
                            {selectedTask?.task_status?.name?.toLowerCase() !== 'completed' ? (
                                <>
                                    <div className={cn(
                                        "border-2 border-dashed border-slate-700 rounded-lg p-4 text-center hover:border-slate-600 transition-colors",
                                        formErrors.attachments && "border-red-500"
                                    )}>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                            <Upload className="w-8 h-8 text-slate-500" />
                                            <span className="text-sm text-slate-400">
                                                Click to upload files
                                            </span>
                                        </label>
                                    </div>
                                    {formErrors.attachments && (
                                        <p className="text-sm text-red-400">{formErrors.attachments}</p>
                                    )}
                                    
                                    {attachments.length > 0 && (
                                        <div className="space-y-2 mt-2">
                                            {attachments.map((file, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-slate-800/50 rounded-md px-3 py-2">
                                                    <File className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-300 truncate flex-1">{file.name}</span>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                                                        className="text-slate-400 hover:text-red-400 hover:bg-slate-700"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-2">
                                    {existingAttachments.length > 0 ? (
                                        existingAttachments.map((attachment) => (
                                            <div key={attachment.id} className="flex items-center gap-2 bg-slate-800/50 rounded-md px-3 py-2">
                                                <File className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-300 truncate flex-1">{attachment.file_name}</span>
                                                <a 
                                                    href={`/storage/${attachment.file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-400 hover:text-indigo-300"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-slate-500 italic">
                                            No attachments
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={closeModal} className="bg-slate-800 border-slate-700 text-white">
                            {selectedTask?.task_status?.name?.toLowerCase() === 'completed' ? 'Close' : 'Cancel'}
                        </Button>
                        {selectedTask?.task_status?.name?.toLowerCase() !== 'completed' && (
                            <Button 
                                onClick={handleSubmitTask} 
                                disabled={submitting || !solution.trim()}
                                className="bg-green-600 hover:bg-green-500 text-white gap-2"
                            >
                                {submitting ? (
                                    <span className="animate-spin"><Clock className="w-4 h-4" /></span>
                                ) : (
                                    <CheckSquare className="w-4 h-4" />
                                )}
                                Submit for Review
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}