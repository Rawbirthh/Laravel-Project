import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { CheckSquare, Clock, TrendingUp, ClipboardList, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import type { Task, TaskStats } from '@/types/Task';

interface Props {
    taskStats: TaskStats;
    recentTasks: Task[];
}

export default function EmployeeDashboard({ taskStats, recentTasks }: Props) {
    // Get current user to filter "You" from group lists
    const auth = usePage().props.auth; 

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
                    <div className="flex gap-3 mb-6">
                        <Button
                            onClick={() => router.get(route('employee.tasks.index'))}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
                        >
                            <ClipboardList className="w-4 h-4" />
                            View My Tasks
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CheckSquare className="w-5 h-5 text-indigo-400" />
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
                                    <Clock className="w-5 h-5 text-amber-400" />
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

                    <Card className="bg-[#0f0f10] border-slate-800/50">
                        <CardHeader>
                            <CardTitle className="text-white">Recent Assigned Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentTasks.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                                        <CheckSquare className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <p className="text-slate-500 text-lg">No tasks assigned yet</p>
                                    <p className="text-slate-600 text-sm mt-1">Tasks will appear here when your manager assigns them</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentTasks.slice(0, 5).map((task) => {
                                        // Logic to prepare group names
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
                                                        {/* Assigner & Status Row */}
                                                        <div className="flex items-center gap-2">
                                                            {task.assigner && (
                                                                <span className="text-xs text-slate-500">
                                                                    From: {task.assigner.name}
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

                                                        {/* Group Task Assignees Row */}
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
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}