import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    Users, ListTodo, AlertTriangle, Building2, Shield, Clock,
    Search, Mail, Calendar, CheckCircle, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    LineChart, Line, Legend, Cell,
} from 'recharts';
import { cn } from '@/lib/utils';
import type { PaginatedResponse, SearchFilter, OverviewStats, TaskDistribution, DepartmentBreakdown, MonthlyTrends, RecentActivity, OverdueTask } from '@/types/index';
import type { User } from '@/types/User';

interface AdminDashboardProps {
    users: PaginatedResponse<User>;
    filters: SearchFilter;
    overviewStats: OverviewStats;
    taskDistribution: TaskDistribution;
    departmentBreakdown: DepartmentBreakdown;
    monthlyTrends: MonthlyTrends;
    recentActivity: RecentActivity;
    overdueTasks: OverdueTask[];
}

const statusColors: Record<string, string> = {
    'Pending': '#f59e0b',
    'In Progress': '#3b82f6',
    'For Review': '#8b5cf6',
    'Completed': '#10b981',
};

const priorityColors: Record<string, string> = {
    'High': '#ef4444',
    'Medium': '#f59e0b',
    'Low': '#6b7280',
    'Critical': '#dc2626',
};

function daysOverdue(dateStr: string): number {
    const due = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - due.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString();
}

const statusBadgeBg = (status: string) => {
    switch (status) {
        case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        case 'In Progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
        case 'For Review': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
        case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
};

export default function AdminDashboard({
    users, filters, overviewStats, taskDistribution,
    departmentBreakdown, monthlyTrends, recentActivity, overdueTasks
}: AdminDashboardProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search);
    const [showAllOverdue, setShowAllOverdue] = useState(false);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        router.get(route('admin.dashboard'), { search: value }, {
            preserveState: true, replace: true,
        });
    };

    const displayedOverdue = useMemo(() =>
        showAllOverdue ? overdueTasks : overdueTasks.slice(0, 5),
        [overdueTasks, showAllOverdue]
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        Admin Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-white flex items-center gap-2 text-sm font-medium">
                                    <Users className="w-4 h-4 text-indigo-400" />
                                    Total Users
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-white">{overviewStats.total_users}</p>
                                <div className="flex gap-2 mt-1 text-xs text-slate-500">
                                    {Object.entries(overviewStats.users_by_role).map(([role, count]) => (
                                        <span key={role} className="capitalize">{role}: {count}</span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-white flex items-center gap-2 text-sm font-medium">
                                    <ListTodo className="w-4 h-4 text-emerald-400" />
                                    Total Tasks
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-white">{overviewStats.total_tasks}</p>
                                <div className="flex gap-2 mt-1 text-xs text-slate-500">
                                    {Object.entries(overviewStats.tasks_by_status).map(([status, count]) => (
                                        <span key={status} className="capitalize">{status}: {count}</span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-white flex items-center gap-2 text-sm font-medium">
                                    <Building2 className="w-4 h-4 text-cyan-400" />
                                    Departments
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-white">{overviewStats.total_departments}</p>
                                <p className="text-xs text-slate-500 mt-1">Organizational units</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-white flex items-center gap-2 text-sm font-medium">
                                    <Shield className="w-4 h-4 text-amber-400" />
                                    Roles
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-white">{overviewStats.total_roles}</p>
                                <p className="text-xs text-slate-500 mt-1">Permission groups</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-white flex items-center gap-2 text-sm font-medium">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    Completed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-white">
                                    {overviewStats.tasks_by_status['Completed'] ?? 0}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {overviewStats.total_tasks > 0
                                        ? `${Math.round(((overviewStats.tasks_by_status['Completed'] ?? 0) / overviewStats.total_tasks) * 100)}% completion rate`
                                        : 'No tasks yet'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={cn(
                            "border",
                            overviewStats.tasks_overdue > 0
                                ? "bg-red-950/30 border-red-800/50"
                                : "bg-[#0f0f10] border-slate-800/50"
                        )}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-white flex items-center gap-2 text-sm font-medium">
                                    <AlertTriangle className={cn(
                                        "w-4 h-4",
                                        overviewStats.tasks_overdue > 0 ? "text-red-400" : "text-slate-400"
                                    )} />
                                    Overdue
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className={cn(
                                    "text-2xl font-bold",
                                    overviewStats.tasks_overdue > 0 ? "text-red-400" : "text-white"
                                )}>
                                    {overviewStats.tasks_overdue}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">Past due & not completed</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Task Distribution Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-[#0f0f10] border-slate-800/50 col-span-1">
                            <CardHeader>
                                <CardTitle className="text-white text-sm font-medium">
                                    Tasks by Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={taskDistribution.by_status}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
                                        />
                                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                            {taskDistribution.by_status.map((entry, idx) => (
                                                <rect key={idx} fill={statusColors[entry.name] || '#6366f1'} />
                                            ))}
                                            {taskDistribution.by_status.map((entry, idx) => (
                                                <Cell key={idx} fill={statusColors[entry.name] || '#6366f1'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="flex flex-wrap gap-3 mt-3 justify-center">
                                    {taskDistribution.by_status.map((s) => (
                                        <div key={s.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: statusColors[s.name] || '#6366f1' }} />
                                            {s.name}: {s.count}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50 col-span-1">
                            <CardHeader>
                                <CardTitle className="text-white text-sm font-medium">
                                    Tasks by Priority
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={taskDistribution.by_priority}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
                                        />
                                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                            {taskDistribution.by_priority.map((entry, idx) => (
                                                <Cell key={idx} fill={priorityColors[entry.name] || '#6366f1'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="flex flex-wrap gap-3 mt-3 justify-center">
                                    {taskDistribution.by_priority.map((p) => (
                                        <div key={p.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: priorityColors[p.name] || '#6366f1' }} />
                                            {p.name}: {p.count}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Task Type + Recent Tasks */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white text-sm font-medium">
                                    Tasks by Type
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={taskDistribution.by_type}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
                                        />
                                        <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#6366f1" />
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="flex flex-wrap gap-3 mt-3 justify-center">
                                    {taskDistribution.by_type.map((t) => (
                                        <div key={t.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
                                            {t.name}: {t.count}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                                    <ListTodo className="w-4 h-4 text-indigo-400" />
                                    Recent Tasks
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {recentActivity.recent_tasks.length === 0 ? (
                                    <p className="text-slate-500 text-sm text-center py-8">No tasks created yet</p>
                                ) : (
                                    recentActivity.recent_tasks.map((task: any) => (
                                        <div key={task.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <Avatar className="w-7 h-7 shrink-0">
                                                    <AvatarImage src={task.assignee?.profile_picture_url} />
                                                    <AvatarFallback className="bg-slate-700 text-white text-xs">
                                                        {task.assignee?.name?.charAt(0)?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-slate-200 truncate">{task.title}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {task.assigner?.name} → {task.assignee?.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                                                    statusBadgeBg(task.taskStatus?.name ?? '')
                                                )}>
                                                    {task.taskStatus?.name}
                                                </span>
                                                <span className="text-xs text-slate-600">{timeAgo(task.created_at)}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Department Activity + Monthly Trends */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-cyan-400" />
                                    Department Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {departmentBreakdown.task_counts.length === 0 ? (
                                    <p className="text-slate-500 text-sm text-center py-8">No department data yet</p>
                                ) : (
                                    departmentBreakdown.task_counts.map((dept) => {
                                        const maxCount = Math.max(...departmentBreakdown.task_counts.map(d => d.task_count ?? 0), 1);
                                        const userCount = departmentBreakdown.user_counts.find(u => u.name === dept.name)?.user_count ?? 0;
                                        const overdueCount = departmentBreakdown.overdue_by_dept.find(o => o.name === dept.name)?.overdue_count ?? 0;
                                        const pct = ((dept.task_count ?? 0) / maxCount) * 100;
                                        return (
                                            <div key={dept.name}>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-slate-200">{dept.name}</span>
                                                        <span className="text-xs text-slate-500">{userCount} users</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs">
                                                        <span className="text-slate-400">{dept.task_count} tasks</span>
                                                        {overdueCount > 0 && (
                                                            <span className="text-red-400">{overdueCount} overdue</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${pct}%`,
                                                            backgroundColor: overdueCount > 0 ? '#ef4444' : '#06b6d4',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                    Monthly Trends (6 Months)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={280}>
                                    <LineChart data={monthlyTrends.months.map((month, i) => ({
                                        month: month.slice(5),
                                        tasks: monthlyTrends.tasks[i],
                                        users: monthlyTrends.users[i],
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
                                        />
                                        <Legend
                                            wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                                        />
                                        <Line type="monotone" dataKey="tasks" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} name="Tasks" />
                                        <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} name="Users" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Overdue Tasks Warning */}
                    {overdueTasks.length > 0 && (
                        <Card className="bg-red-950/20 border-red-800/40">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-400" />
                                        Overdue Tasks ({overdueTasks.length})
                                    </CardTitle>
                                    {overdueTasks.length > 5 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowAllOverdue(!showAllOverdue)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-950/50 text-xs"
                                        >
                                            {showAllOverdue ? 'Show Less' : `Show All (${overdueTasks.length})`}
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-red-800/30">
                                                <th className="text-left py-2 px-3 text-red-300 text-xs font-medium">Task</th>
                                                <th className="text-left py-2 px-3 text-red-300 text-xs font-medium">Assignee</th>
                                                <th className="text-left py-2 px-3 text-red-300 text-xs font-medium">Due Date</th>
                                                <th className="text-left py-2 px-3 text-red-300 text-xs font-medium">Status</th>
                                                <th className="text-left py-2 px-3 text-red-300 text-xs font-medium">Dept</th>
                                                <th className="text-left py-2 px-3 text-red-300 text-xs font-medium">Days Overdue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedOverdue.map((task) => (
                                                <tr key={task.id} className="border-b border-red-800/20 hover:bg-red-950/30 transition-colors">
                                                    <td className="py-2.5 px-3 text-slate-200 text-sm">{task.title}</td>
                                                    <td className="py-2.5 px-3">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="w-6 h-6">
                                                                <AvatarImage src={task.assignee?.profile_picture_url} />
                                                                <AvatarFallback className="bg-slate-700 text-white text-[10px]">
                                                                    {task.assignee?.name?.charAt(0)?.toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-sm text-slate-300">{task.assignee?.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-2.5 px-3 text-slate-400 text-sm">{new Date(task.due_date).toLocaleDateString()}</td>
                                                    <td className="py-2.5 px-3">
                                                        <span className={cn(
                                                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                                                            statusBadgeBg(task.taskStatus?.name ?? '')
                                                        )}>
                                                            {task.taskStatus?.name}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 px-3 text-slate-400 text-sm">{task.department?.name ?? '—'}</td>
                                                    <td className="py-2.5 px-3">
                                                        <span className="inline-flex items-center gap-1 text-red-400 text-sm font-medium">
                                                            <Clock className="w-3 h-3" />
                                                            {daysOverdue(task.due_date)}d
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Users Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                                    <Users className="w-4 h-4 text-emerald-400" />
                                    New Users
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {recentActivity.new_users.length === 0 ? (
                                    <p className="text-slate-500 text-sm text-center py-8">No users registered yet</p>
                                ) : (
                                    recentActivity.new_users.map((user: any) => (
                                        <div key={user.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-800/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={user.profile_picture_url} />
                                                    <AvatarFallback className="bg-slate-700 text-white text-xs">
                                                        {user.name?.charAt(0)?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-200">{user.name}</p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                {user.roles?.map((role: any) => (
                                                    <span key={role.id} className={cn(
                                                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                                                        role.slug === 'admin'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                            : 'bg-slate-700/50 text-slate-300 border-slate-600/30'
                                                    )}>
                                                        {role.name}
                                                    </span>
                                                ))}
                                                <span className="text-slate-600">{timeAgo(user.created_at)}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <Users className="w-5 h-5 text-indigo-400" />
                                        All Users ({users.total})
                                    </CardTitle>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="pl-9 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 w-64"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-800/50">
                                                <th className="text-left py-3 px-4 text-slate-300 font-medium">User</th>
                                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Email</th>
                                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Role</th>
                                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.data.map((user) => (
                                                <tr key={user.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="w-7 h-7">
                                                                <AvatarImage src={user.profile_picture_url} />
                                                                <AvatarFallback className="bg-slate-700 text-white text-xs">
                                                                    {user.name?.charAt(0)?.toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-slate-200 text-sm">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-400 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-4 h-4 shrink-0" />
                                                            {user.email}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {user.roles && user.roles.length > 0 ? (
                                                            <div className="flex gap-1 flex-wrap">
                                                                {user.roles.map((role: any) => (
                                                                    <span
                                                                        key={role.id}
                                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                                            role.slug === 'admin'
                                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                                                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                                                                        }`}
                                                                    >
                                                                        <Shield className="w-3 h-3 mr-1" />
                                                                        {role.name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/30">
                                                                User
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-400 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 shrink-0" />
                                                            {new Date(user.created_at).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {users.last_page > 1 && (
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                                        <div className="text-sm text-slate-400">
                                            Showing {users.from} to {users.to} of {users.total} users
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.get(route('admin.dashboard'), { page: users.current_page - 1, search: searchQuery })}
                                                disabled={users.current_page === 1}
                                                className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                            >
                                                Previous
                                            </Button>
                                            <span className="text-sm text-slate-400">
                                                Page {users.current_page} of {users.last_page}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.get(route('admin.dashboard'), { page: users.current_page + 1, search: searchQuery })}
                                                disabled={users.current_page === users.last_page}
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
            </div>
        </AuthenticatedLayout>
    );
}
