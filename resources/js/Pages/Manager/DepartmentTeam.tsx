import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Search, Users, CheckSquare, Clock, TrendingUp, AlertTriangle, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import UserAvatar from '@/Components/UserAvatar';

interface TeamMember {
    id: number;
    name: string;
    email: string;
    profile_picture?: string;
    profile_picture_url?: string;
    roles: { id: number; name: string }[];
    taskStats: {
        total: number;
        pending: number;
        in_progress: number;
        for_review: number;
        completed: number;
        high_priority: number;
    };
}

interface Props {
    employees: {
        data: TeamMember[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: { search: string };
}

const statConfig = [
    { key: 'total' as const, label: 'Total', icon: ClipboardList, color: 'indigo' },
    { key: 'pending' as const, label: 'Pending', icon: Clock, color: 'yellow' },
    { key: 'in_progress' as const, label: 'In Progress', icon: TrendingUp, color: 'blue' },
    { key: 'for_review' as const, label: 'For Review', icon: Clock, color: 'amber' },
    { key: 'completed' as const, label: 'Completed', icon: CheckSquare, color: 'green' },
    { key: 'high_priority' as const, label: 'High Priority', icon: AlertTriangle, color: 'red' },
];

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400' },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
};

export default function DepartmentTeam({ employees, filters }: Props) {
    const [search, setSearch] = useState(filters.search);

    const handleSearch = () => {
        router.get(route('manager.department-team'), {
            search: search || undefined,
        }, { preserveState: true, replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('manager.department-team'), {
            search: search || undefined,
            page,
        }, { preserveState: true, replace: true });
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
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        Department Team ({employees.total})
                    </h2>
                </div>
            }
        >
            <Head title="Department Team" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-500/10">
                                <Users className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Team Members</p>
                                <p className="text-xs text-slate-500">{employees.total} employee{employees.total !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search team members..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-9 bg-[#0f0f10] border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 w-64"
                                />
                            </div>
                            <Button
                                onClick={handleSearch}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white"
                            >
                                Search
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {employees.data.length === 0 ? (
                            <Card className="bg-[#0f0f10] border-slate-800/50">
                                <CardContent className="py-12">
                                    <div className="text-center">
                                        <Users className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                                        <p className="text-slate-500">
                                            {search ? 'No team members found' : 'No team members in your department'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            employees.data.map((member) => (
                                <Card key={member.id} className="bg-[#0f0f10] border-slate-800/50 hover:border-slate-700/50 transition-colors">
                                    <CardContent className="py-2">
                                        <div className="flex items-center gap-6">
                                            <button onClick={() => router.get(route('manager.employees.show', member.id))} className="shrink-0">
                                                <UserAvatar user={member} size="xl" className="w-20 h-20" />
                                            </button>
                                            <div className="min-w-0 shrink-0 w-[220px]">
                                                <button
                                                    onClick={() => router.get(route('manager.employees.show', member.id))}
                                                    className="text-left"
                                                >
                                                    <p className="text-lg font-semibold text-slate-200 hover:text-indigo-400 transition-colors truncate">
                                                        {member.name}
                                                    </p>
                                                </button>
                                                <p className="text-sm text-slate-500 truncate">{member.email}</p>
                                                {member.roles && member.roles.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                        {member.roles.map((role) => (
                                                            <span
                                                                key={role.id}
                                                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                                                            >
                                                                {role.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                                                {statConfig.map((stat) => {
                                                    const colors = colorMap[stat.color];
                                                    const Icon = stat.icon;
                                                    return (
                                                        <div
                                                            key={stat.key}
                                                        className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-lg border flex-1 max-w-[100px] min-w-[72px] ${colors.bg} ${colors.border}`}
                                                        >
                                                            <Icon className={`w-4 h-4 ${colors.text}`} />
                                                            <span className="text-lg font-bold text-white leading-tight text-center">
                                                                {member.taskStats[stat.key]}
                                                            </span>
                                                            <span className="text-[10px] font-medium text-slate-300 leading-tight text-center">
                                                                {stat.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}

                        {employees.last_page > 1 && (
                            <div className="flex items-center justify-between pt-4">
                                <div className="text-sm text-slate-400">
                                    Showing {employees.from} to {employees.to} of {employees.total}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(employees.current_page - 1)}
                                        disabled={employees.current_page === 1}
                                        className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm text-slate-400">
                                        Page {employees.current_page} of {employees.last_page}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(employees.current_page + 1)}
                                        disabled={employees.current_page === employees.last_page}
                                        className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}