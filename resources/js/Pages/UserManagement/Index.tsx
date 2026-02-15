import type { User, Role, Department } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Search,
    User as UserIcon,
    Shield,
    Building2,
    Edit2
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { PaginatedResponse , SearchFilter} from '@/types/index';

interface IndexProps {
    departments: PaginatedResponse<User>;
    filters: SearchFilter;
    users: PaginatedResponse<User>;
}

export default function Index({ users, filters }: IndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        router.get(route('admin.user-management.index'), { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        User Management
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-slate-400">
                                {users.total} {users.total === 1 ? 'User' : 'Users'}
                            </span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="User Management" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="bg-[#0f0f10] border-slate-800/50 shadow-xl">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                    <UserIcon className="w-5 h-5 text-indigo-400" />
                                    All Users
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
                            {users.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                                        <UserIcon className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <p className="text-slate-500 text-lg">
                                        {searchQuery ? 'No users found' : 'No users yet'}
                                    </p>
                                    <p className="text-slate-600 text-sm mt-1">
                                        {searchQuery ? 'Try a different search term' : 'Users will appear here when registered'}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-800">
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Name</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Email</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Roles</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Departments</th>
                                                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.data.map((user) => (
                                                    <tr
                                                        key={user.id}
                                                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                                                    >
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                                                    <UserIcon className="w-4 h-4 text-indigo-400" />
                                                                </div>
                                                                <span className="font-medium text-slate-200">{user.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className="text-slate-300">{user.email}</span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {user.roles && user.roles.length > 0 ? (
                                                                    user.roles.map((role) => (
                                                                        <span
                                                                            key={role.id}
                                                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                                                        >
                                                                            {role.name}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-slate-500 text-sm">No roles</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {user.departments && user.departments.length > 0 ? (
                                                                    user.departments.map((dept) => (
                                                                        <span
                                                                            key={dept.id}
                                                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                                        >
                                                                            {dept.name}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-slate-500 text-sm">No departments</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => router.get(route('admin.user-management.edit', user.id))}
                                                                className="text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 h-8 w-8"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </Button>
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
                                                    onClick={() => router.get(route('admin.user-management.index'), { page: users.current_page - 1, search: searchQuery })}
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
                                                    onClick={() => router.get(route('admin.user-management.index'), { page: users.current_page + 1, search: searchQuery })}
                                                    disabled={users.current_page === users.last_page}
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
        </AuthenticatedLayout>
    );
}
