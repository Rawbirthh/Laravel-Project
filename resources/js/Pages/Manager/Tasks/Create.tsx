import type { User } from '@/types/User';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    ArrowLeft, Save, Loader2, UserCheck, Calendar, Flag, FileText, Users, Activity, Tag
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import InputLabel from '@/Components/InputLabel';
import UserAvatar from '@/Components/UserAvatar';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import type { TaskPriority, TaskType } from '@/types/Task';

interface Props {
    employees: User[];
    priorities: TaskPriority[];
    types: TaskType[];
}

export default function ManagerTasksCreate({ employees,priorities, types }: Props) {
    const [taskType, setTaskType] = useState<'individual' | 'group'>('individual');

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        status_id: '',
        priority_id: '',
        type_id: '',
        due_date: '',
        task_type: 'individual',
        assigned_to: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('manager.tasks.store'));
    };

    const handleEmployeeSelect = (employeeId: string) => {
        if (taskType === 'individual') {
            setData('assigned_to', [employeeId]);
        } else {
            // Toggle selection for group
            if (data.assigned_to.includes(employeeId)) {
                setData('assigned_to', data.assigned_to.filter(id => id !== employeeId));
            } else {
                setData('assigned_to', [...data.assigned_to, employeeId]);
            }
        }
    };

    const handleTaskTypeChange = (type: 'individual' | 'group') => {
        setTaskType(type);
        setData('task_type', type);
        setData('assigned_to', []); // Reset selection on type change
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.get(route('manager.tasks.index'))}
                        className="text-slate-400 hover:text-white hover:bg-slate-800/50"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h2 className="text-xl font-semibold text-white tracking-tight">Assign New Task</h2>
                </div>
            }
        >
            <Head title="Assign New Task" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Task Details */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="bg-[#0f0f10] border-slate-800/50 shadow-xl">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-indigo-400" />
                                            Task Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Title */}
                                        <div className="grid gap-2">
                                            <InputLabel htmlFor="title" className="text-slate-300">Task Title *</InputLabel>
                                            <Input
                                                id="title"
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                                placeholder="Enter task title"
                                            />
                                            {errors.title && (
                                                <p className="text-sm text-red-400">{errors.title}</p>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div className="grid gap-2">
                                            <InputLabel htmlFor="description" className="text-slate-300">Description</InputLabel>
                                            <textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                rows={4}
                                                className="bg-slate-900/50 border border-slate-800 text-slate-200 placeholder:text-slate-500 rounded-md px-3 py-2 text-sm focus:border-indigo-500/50 focus:ring-indigo-500/20 focus:outline-none"
                                                placeholder="Enter task description"
                                            />
                                            {errors.description && (
                                                <p className="text-sm text-red-400">{errors.description}</p>
                                            )}
                                        </div>

                                        {/* Status, Priority, Type - Horizontal Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Status */}
                                            

                                            {/* Priority */}
                                            <div className="grid gap-2">
                                                <InputLabel className="text-slate-300 flex items-center gap-2">
                                                    <Flag className="w-4 h-4" />
                                                    Priority *
                                                </InputLabel>
                                                <Select value={data.priority_id} onValueChange={(value) => setData('priority_id', value)}>
                                                    <SelectTrigger className="bg-slate-900/50 border-slate-800 text-slate-200">
                                                        <SelectValue placeholder="Select priority" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800">
                                                        {priorities.map((priority) => (
                                                            <SelectItem key={priority.id} value={priority.id.toString()} className="text-slate-200 focus:bg-slate-100">
                                                                {priority.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.priority_id && (
                                                    <p className="text-sm text-red-400">{errors.priority_id}</p>
                                                )}
                                            </div>

                                            {/* Type */}
                                            <div className="grid gap-2">
                                                <InputLabel className="text-slate-300 flex items-center gap-2">
                                                    <Tag className="w-4 h-4" />
                                                    Type
                                                </InputLabel>
                                                <Select value={data.type_id} onValueChange={(value) => setData('type_id', value)}>
                                                    <SelectTrigger className="bg-slate-900/50 border-slate-800 text-slate-200">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800">
                                                        {types.map((type) => (
                                                            <SelectItem key={type.id} value={type.id.toString()} className="text-slate-200 focus:bg-slate-100">
                                                                {type.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.type_id && (
                                                    <p className="text-sm text-red-400">{errors.type_id}</p>
                                                )}
                                            </div>
                                            <div className="grid gap-2">
                                                <InputLabel htmlFor="due_date" className="text-slate-300 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    Due Date
                                                </InputLabel>
                                                <Input
                                                    id="due_date"
                                                    type="date"
                                                    value={data.due_date}
                                                    onChange={(e) => setData('due_date', e.target.value)}
                                                    className="bg-slate-900/50 border-slate-800 text-slate-200 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                                />
                                                {errors.due_date && (
                                                    <p className="text-sm text-red-400">{errors.due_date}</p>
                                                )}
                                            </div>
                                        </div>

                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column - Assignment */}
                            <div className="space-y-6">
                                {/* Task Type Selection */}
                                <Card className="bg-[#0f0f10] border-slate-800/50 shadow-xl">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <Users className="w-5 h-5 text-indigo-400" />
                                            Assignment Type
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleTaskTypeChange('individual')}
                                                className={cn(
                                                    "py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2",
                                                    taskType === 'individual'
                                                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
                                                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                                                )}
                                            >
                                                <Users className="w-4 h-4" />
                                                Individual Task
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleTaskTypeChange('group')}
                                                className={cn(
                                                    "py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2",
                                                    taskType === 'group'
                                                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
                                                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                                                )}
                                            >
                                                <Users className="w-4 h-4" />
                                                Group Task
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-3 text-center">
                                            {taskType === 'individual' 
                                                ? 'Select exactly 1 employee.' 
                                                : 'Select 2 or more employees.'
                                            }
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Employee Selection */}
                                <Card className="bg-[#0f0f10] border-slate-800/50 shadow-xl">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <UserCheck className="w-5 h-5 text-emerald-400" />
                                            Assign To {taskType === 'group' ? 'Employees' : 'Employee'} *
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {employees.length === 0 ? (
                                            <div className="text-center py-8">
                                                <UserCheck className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                                                <p className="text-slate-500">No employees available</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
                                                {employees.map((employee) => {
                                                    const isSelected = data.assigned_to.includes(employee.id.toString());
                                                    return (
                                                        <div
                                                            key={employee.id}
                                                            onClick={() => handleEmployeeSelect(employee.id.toString())}
                                                            className={cn(
                                                                "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                                                                isSelected
                                                                    ? "border-emerald-500/50 bg-emerald-500/10"
                                                                    : "border-slate-800/50 bg-slate-900/30 hover:bg-slate-800/30 hover:border-slate-700/50"
                                                            )}
                                                        >
                                                            <UserAvatar user={employee} size="md" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-slate-200 truncate">{employee.name}</p>
                                                                <p className="text-xs text-slate-400 truncate">{employee.email}</p>
                                                            </div>
                                                            {isSelected && (
                                                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {errors.assigned_to && (
                                            <p className="text-sm text-red-400 mt-3">{errors.assigned_to}</p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Submit Buttons */}
                                <div className="flex items-center justify-end gap-3">
                                    <Button
                                        type="button"
                                        onClick={() => router.get(route('manager.tasks.index'))}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
                                    >
                                        {processing ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        Assign Task
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}