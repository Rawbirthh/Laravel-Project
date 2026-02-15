import type { Role } from '@/types/Role';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Plus, 
    Trash2, 
    Edit2, 
    Shield,
    X,
    Save,
    Loader2,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';
import { PaginatedResponse , SearchFilter} from '@/types/index';

interface IndexProps {
    departments: PaginatedResponse<Role>;
    filters: SearchFilter;
    roles: PaginatedResponse<Role>;
}

export default function Index({ roles, filters }: IndexProps) {
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search);

    const { data, setData, post, put, delete: destroy, errors, reset, processing } = useForm({
        code: '',
        name: '',
        slug: '',
    });

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        router.get(route('admin.roles.index'), { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCreate = () => {
        setIsCreating(true);
        setEditingRole(null);
        reset();
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setIsCreating(false);
        setData({
            code: role.code,
            name: role.name,
            slug: role.slug || '',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRole) {
            put(route('admin.roles.update', editingRole.id), {
                onSuccess: () => {
                    setEditingRole(null);
                    reset();
                },
            });
        } else {
            post(route('admin.roles.store'), {
                onSuccess: () => {
                    reset();
                    setIsCreating(false);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            destroy(route('admin.roles.destroy', id), {
                onSuccess: () => {
                    if (editingRole?.id === id) {
                        setEditingRole(null);
                        reset();
                    }
                },
            });
        }
    };

    const handleCancel = () => {
        setEditingRole(null);
        setIsCreating(false);
        reset();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        Roles
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-slate-400">
                                {roles.total} {roles.total === 1 ? 'Role' : 'Roles'}
                            </span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Roles" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Form */}
                        <div className="lg:col-span-1">
                            <Card className="bg-[#0f0f10] border-slate-800/50 shadow-xl sticky top-4">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                        {editingRole ? (
                                            <>
                                                <Edit2 className="w-5 h-5 text-indigo-400" />
                                                Edit Role
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-5 h-5 text-indigo-400" />
                                                {isCreating ? 'Create New Role' : 'Add Role'}
                                            </>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!isCreating && !editingRole ? (
                                        <Button
                                            onClick={handleCreate}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Create Role
                                        </Button>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label
                                                    htmlFor="code"
                                                    className="block text-sm font-medium text-slate-300 mb-1.5"
                                                >
                                                    Code
                                                </label>
                                                <Input
                                                    id="code"
                                                    type="text"
                                                    value={data.code}
                                                    onChange={(e) =>
                                                        setData('code', e.target.value)
                                                    }
                                                    placeholder="e.g., ADMIN, USER, MANAGER"
                                                    className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                                />
                                                {errors.code && (
                                                    <p className="mt-1.5 text-sm text-rose-400">
                                                        {errors.code}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="name"
                                                    className="block text-sm font-medium text-slate-300 mb-1.5"
                                                >
                                                    Name
                                                </label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData('name', e.target.value)
                                                    }
                                                    placeholder="e.g., Administrator"
                                                    className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                                />
                                                {errors.name && (
                                                    <p className="mt-1.5 text-sm text-rose-400">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="slug"
                                                    className="block text-sm font-medium text-slate-300 mb-1.5"
                                                >
                                                    Slug (optional)
                                                </label>
                                                <Input
                                                    id="slug"
                                                    type="text"
                                                    value={data.slug}
                                                    onChange={(e) =>
                                                        setData('slug', e.target.value)
                                                    }
                                                    placeholder="e.g., administrator"
                                                    className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                                />
                                                {errors.slug && (
                                                    <p className="mt-1.5 text-sm text-rose-400">
                                                        {errors.slug}
                                                    </p>
                                                )}
                                            </div>

                                            <Separator className="bg-slate-800/50" />

                                            <div className="flex gap-3 pt-2">
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
                                                >
                                                    {processing ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Save className="w-4 h-4" />
                                                    )}
                                                    {editingRole ? 'Update' : 'Create'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handleCancel}
                                                    className="bg-slate-800/50 text-white hover:bg-slate-800/50 hover:text-white"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Table */}
                        <div className="lg:col-span-2">
                            <Card className="bg-[#0f0f10] border-slate-800/50 shadow-xl">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-white text-lg flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-indigo-400" />
                                            All Roles
                                        </CardTitle>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                type="text"
                                                placeholder="Search roles..."
                                                value={searchQuery}
                                                onChange={(e) => handleSearch(e.target.value)}
                                                className="pl-9 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 w-64"
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {roles.data.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                                                <Shield className="w-8 h-8 text-slate-600" />
                                            </div>
                                            <p className="text-slate-500 text-lg">
                                                {searchQuery ? 'No roles found' : 'No roles yet'}
                                            </p>
                                            <p className="text-slate-600 text-sm mt-1">
                                                {searchQuery ? 'Try a different search term' : 'Create your first role to get started'}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-slate-800">
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Code</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Name</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Slug</th>
                                                            <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {roles.data.map((role) => (
                                                            <tr
                                                                key={role.id}
                                                                className={cn(
                                                                    "border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors",
                                                                    editingRole?.id === role.id && "bg-indigo-500/10"
                                                                )}
                                                            >
                                                                <td className="py-3 px-4">
                                                                    <span className="font-medium text-slate-200">{role.code}</span>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <span className="text-slate-300">{role.name}</span>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <span className="text-slate-400 text-sm">{role.slug || '-'}</span>
                                                                </td>
                                                                <td className="py-3 px-4 text-right">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleEdit(role)}
                                                                            className="text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 h-8 w-8"
                                                                        >
                                                                            <Edit2 className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleDelete(role.id)}
                                                                            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination */}
                                            {roles.last_page > 1 && (
                                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                                                    <div className="text-sm text-slate-400">
                                                        Showing {roles.from} to {roles.to} of {roles.total} roles
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.get(route('admin.roles.index'), { page: roles.current_page - 1, search: searchQuery })}
                                                            disabled={roles.current_page === 1}
                                                            className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                                        >
                                                            Previous
                                                        </Button>
                                                        <span className="text-sm text-slate-400">
                                                            Page {roles.current_page} of {roles.last_page}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.get(route('admin.roles.index'), { page: roles.current_page + 1, search: searchQuery })}
                                                            disabled={roles.current_page === roles.last_page}
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
