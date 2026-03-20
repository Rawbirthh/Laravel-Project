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
import { Textarea } from '@/Components/ui/textarea';
import { PaginatedResponse, SearchFilter } from '@/types/index';

interface Permission {
    id: number;
    permission_name: string;
    display_name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

interface PermissionFormData {
    permission_name: string;
    display_name: string;
    description: string;
}

interface IndexProps {
    permissions: PaginatedResponse<Permission>;
    filters: SearchFilter;
}

export default function Index({ permissions, filters }: IndexProps) {
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search);

    const { data, setData, post, put, delete: destroy, errors, reset, processing } = useForm<PermissionFormData>({
        permission_name: '',
        display_name: '',
        description: '',
    });

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        router.get(route('admin.permissions.index'), { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCreate = () => {
        setIsCreating(true);
        setEditingPermission(null);
        reset();
    };

    const handleEdit = (permission: Permission) => {
        setEditingPermission(permission);
        setIsCreating(false);
        setData({
            permission_name: permission.permission_name,
            display_name: permission.display_name,
            description: permission.description || '',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPermission) {
            put(route('admin.permissions.update', editingPermission.id), {
                onSuccess: () => {
                    setEditingPermission(null);
                    reset();
                },
            });
        } else {
            post(route('admin.permissions.store'), {
                onSuccess: () => {
                    reset();
                    setIsCreating(false);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this permission?')) {
            destroy(route('admin.permissions.destroy', id), {
                onSuccess: () => {
                    if (editingPermission?.id === id) {
                        setEditingPermission(null);
                        reset();
                    }
                },
            });
        }
    };

    const handleCancel = () => {
        setEditingPermission(null);
        setIsCreating(false);
        reset();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        Permissions
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-slate-400">
                                {permissions.total} {permissions.total === 1 ? 'Permission' : 'Permissions'}
                            </span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Permissions" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Form */}
                        <div className="lg:col-span-1">
                            <Card className="bg-[#0f0f10] border-slate-800/50 shadow-xl sticky top-4">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                        {editingPermission ? (
                                            <>
                                                <Edit2 className="w-5 h-5 text-indigo-400" />
                                                Edit Permission
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-5 h-5 text-indigo-400" />
                                                {isCreating ? 'Create New Permission' : 'Add Permission'}
                                            </>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!isCreating && !editingPermission ? (
                                        <Button
                                            onClick={handleCreate}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Create Permission
                                        </Button>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label
                                                    htmlFor="permission_name"
                                                    className="block text-sm font-medium text-slate-300 mb-1.5"
                                                >
                                                    Permission Name
                                                </label>
                                                <Input
                                                    id="permission_name"
                                                    type="text"
                                                    value={data.permission_name}
                                                    onChange={(e) =>
                                                        setData('permission_name', e.target.value)
                                                    }
                                                    placeholder="e.g., create-users, edit-tasks"
                                                    className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                                />
                                                {errors.permission_name && (
                                                    <p className="mt-1.5 text-sm text-rose-400">
                                                        {errors.permission_name}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="display_name"
                                                    className="block text-sm font-medium text-slate-300 mb-1.5"
                                                >
                                                    Display Name
                                                </label>
                                                <Input
                                                    id="display_name"
                                                    type="text"
                                                    value={data.display_name}
                                                    onChange={(e) =>
                                                        setData('display_name', e.target.value)
                                                    }
                                                    placeholder="e.g., Create Users, Edit Tasks"
                                                    className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                                />
                                                {errors.display_name && (
                                                    <p className="mt-1.5 text-sm text-rose-400">
                                                        {errors.display_name}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="description"
                                                    className="block text-sm font-medium text-slate-300 mb-1.5"
                                                >
                                                    Description (optional)
                                                </label>
                                                <Textarea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={(e) =>
                                                        setData('description', e.target.value)
                                                    }
                                                    placeholder="Describe what this permission allows..."
                                                    className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 min-h-[100px]"
                                                />
                                                {errors.description && (
                                                    <p className="mt-1.5 text-sm text-rose-400">
                                                        {errors.description}
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
                                                    {editingPermission ? 'Update' : 'Create'}
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
                                            All Permissions
                                        </CardTitle>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                type="text"
                                                placeholder="Search permissions..."
                                                value={searchQuery}
                                                onChange={(e) => handleSearch(e.target.value)}
                                                className="pl-9 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 w-64"
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {permissions.data.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                                                <Shield className="w-8 h-8 text-slate-600" />
                                            </div>
                                            <p className="text-slate-500 text-lg">
                                                {searchQuery ? 'No permissions found' : 'No permissions yet'}
                                            </p>
                                            <p className="text-slate-600 text-sm mt-1">
                                                {searchQuery ? 'Try a different search term' : 'Create your first permission to get started'}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-slate-800">
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Permission Name</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Display Name</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Description</th>
                                                            <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {permissions.data.map((permission) => (
                                                            <tr
                                                                key={permission.id}
                                                                className={cn(
                                                                    "border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors",
                                                                    editingPermission?.id === permission.id && "bg-indigo-500/10"
                                                                )}
                                                            >
                                                                <td className="py-3 px-4">
                                                                    <span className="font-medium text-slate-200">{permission.permission_name}</span>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <span className="text-slate-300">{permission.display_name}</span>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <span className="text-slate-400 text-sm line-clamp-1">{permission.description || '-'}</span>
                                                                </td>
                                                                <td className="py-3 px-4 text-right">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleEdit(permission)}
                                                                            className="text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 h-8 w-8"
                                                                        >
                                                                            <Edit2 className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleDelete(permission.id)}
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
                                            {permissions.last_page > 1 && (
                                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                                                    <div className="text-sm text-slate-400">
                                                        Showing {permissions.from} to {permissions.to} of {permissions.total} permissions
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.get(route('admin.permissions.index'), { page: permissions.current_page - 1, search: searchQuery })}
                                                            disabled={permissions.current_page === 1}
                                                            className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                                        >
                                                            Previous
                                                        </Button>
                                                        <span className="text-sm text-slate-400">
                                                            Page {permissions.current_page} of {permissions.last_page}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.get(route('admin.permissions.index'), { page: permissions.current_page + 1, search: searchQuery })}
                                                            disabled={permissions.current_page === permissions.last_page}
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
