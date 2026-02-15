import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Users, CheckSquare, TrendingUp, Building2, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ManagerDashboard({ stats, users, recentTodos }: any) {
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-indigo-400" />
                                    Total Users
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                            </CardContent>
                        </Card> */}

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
                                <p className="text-3xl font-bold text-white">{stats.totalTodos}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-blue-400" />
                                    Completed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-white">{stats.completedTodos}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white">Team Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {users.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500">No team members yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {users.slice(0, 5).map((user: any) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800/50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                                                        <span className="text-white font-medium">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-200">{user.name}</p>
                                                        <p className="text-xs text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 flex-wrap">
                                                    {user.roles && user.roles.length > 0 ? (
                                                        user.roles.map((role: any) => (
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
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white">Recent Team Tasks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentTodos.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500">No recent tasks</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {recentTodos.slice(0, 5).map((todo: any) => (
                                            <div
                                                key={todo.id}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/50"
                                            >
                                                <div
                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                        todo.completed
                                                            ? 'bg-emerald-500 border-emerald-500'
                                                            : 'border-slate-600'
                                                    }`}
                                                >
                                                    {todo.completed && (
                                                        <div className="w-3 h-3 bg-white rounded-sm" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p
                                                        className={`text-sm font-medium ${
                                                            todo.completed ? 'text-slate-500 line-through' : 'text-slate-200'
                                                        }`}
                                                    >
                                                        {todo.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {todo.user?.name || 'Unknown'} • {new Date(todo.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
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
