import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Users, Shield, Mail, Calendar, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaginatedResponse, SearchFilter } from '@/types/index';
import type { User } from '@/types';

interface AdminDashboardProps {
    users: PaginatedResponse<User>;
    filters: SearchFilter;
}

export default function AdminDashboard({ users, filters }: AdminDashboardProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        router.get(route('admin.dashboard'), { search: value }, {
            preserveState: true,
            replace: true,
        });
    };
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
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-indigo-400" />
                                    Total Users
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-white">{users.total}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-emerald-400" />
                                    Admin Users
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-white">
                                    {users.data.filter((u) => u.roles?.some((r: any) => r.slug === 'admin')).length}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-amber-400" />
                                    Regular Users
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-white">
                                    {users.data.filter((u) => !u.roles?.some((r: any) => r.slug === 'admin')).length}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-[#0f0f10] border-slate-800/50">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-white">All Users ({users.total})</CardTitle>
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
                                            <th className="text-left py-3 px-4 text-slate-300 font-medium">Name</th>
                                            <th className="text-left py-3 px-4 text-slate-300 font-medium">Email</th>
                                            <th className="text-left py-3 px-4 text-slate-300 font-medium">Role</th>
                                            <th className="text-left py-3 px-4 text-slate-300 font-medium">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.map((user) => (
                                            <tr key={user.id} className="border-b border-slate-800/30">
                                                <td className="py-3 px-4 text-slate-200">{user.name}</td>
                                                <td className="py-3 px-4 text-slate-400 flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    {user.email}
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
                                                <td className="py-3 px-4 text-slate-400 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(user.created_at).toLocaleDateString()}
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
        </AuthenticatedLayout>
    );
}
