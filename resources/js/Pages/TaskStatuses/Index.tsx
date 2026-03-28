import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Plus, 
    Trash2, 
    Edit2, 
    Activity,
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
import { PaginatedResponse, SearchFilter } from '@/types/index';
import { TaskStatus } from '@/types/Task';

interface TaskStatusFormData {
    name: string;
}

interface IndexProps {
    statuses: PaginatedResponse<TaskStatus>;
    filters: SearchFilter;
}

export default function Index({ statuses, filters }: IndexProps) {
    const [editingStatus, setEditingStatus] = useState<TaskStatus | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search);

    const { data, setData, post, put, delete: destroy, errors, reset, processing } = useForm<TaskStatusFormData>({
        name: '',
    });

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        router.get(route('admin.task-statuses.index'), { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCreate = () => {
        setIsCreating(true);
        setEditingStatus(null);
        reset();
    };

    const handleEdit = (status: TaskStatus) => {
        setEditingStatus(status);
        setIsCreating(false);
        setData({
            name: status.name,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingStatus) {
            put(route('admin.task-statuses.update', editingStatus.id), {
                onSuccess: () => {
                    setEditingStatus(null);
                    reset();
                },
            });
        } else {
            post(route('admin.task-statuses.store'), {
                onSuccess: () => {
                    reset();
                    setIsCreating(false);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this task status?')) {
            destroy(route('admin.task-statuses.destroy', id), {
                onSuccess: () => {
                    if (editingStatus?.id === id) {
                        setEditingStatus(null);
                        reset();
                    }
                },
            });
        }
    };

    const handleCancel = () => {
        setEditingStatus(null);
        setIsCreating(false);
        reset();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        Task Statuses
                    </h2>
                </div>
            }
        >
            <Head title="Task Statuses" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Form */}
                        <div className="lg:col-span-1">
                            <Card className="bg-[#0f0f10] border-slate-800/50 shadow-xl sticky top-4">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                        {editingStatus ? (
                                            <>
                                                <Edit2 className="w-5 h-5 text-indigo-400" />
                                                Edit Status
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-5 h-5 text-indigo-400" />
                                                {isCreating ? 'Create New Status' : 'Add Status'}
                                            </>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!isCreating && !editingStatus ? (
                                        <Button
                                            onClick={handleCreate}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Create Status
                                        </Button>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label
                                                    htmlFor="name"
                                                    className="block text-sm font-medium text-slate-300 mb-1.5"
                                                >
                                                    Status Name
                                                </label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData('name', e.target.value)
                                                    }
                                                    placeholder="e.g., Pending, In Progress, Completed"
                                                    className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                                />
                                                {errors.name && (
                                                    <p className="mt-1.5 text-sm text-rose-400">
                                                        {errors.name}
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
                                                    {editingStatus ? 'Update' : 'Create'}
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
                                            <Activity className="w-5 h-5 text-indigo-400" />
                                            All Statuses ({statuses.total})
                                        </CardTitle>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                type="text"
                                                placeholder="Search statuses..."
                                                value={searchQuery}
                                                onChange={(e) => handleSearch(e.target.value)}
                                                className="pl-9 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 w-64"
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {statuses.data.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                                                <Activity className="w-8 h-8 text-slate-600" />
                                            </div>
                                            <p className="text-slate-500 text-lg">
                                                {searchQuery ? 'No statuses found' : 'No statuses yet'}
                                            </p>
                                            <p className="text-slate-600 text-sm mt-1">
                                                {searchQuery ? 'Try a different search term' : 'Create your first status to get started'}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-slate-800">
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Name</th>
                                                            <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {statuses.data.map((status) => (
                                                            <tr
                                                                key={status.id}
                                                                className={cn(
                                                                    "border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors",
                                                                    editingStatus?.id === status.id && "bg-indigo-500/10"
                                                                )}
                                                            >
                                                                <td className="py-3 px-4">
                                                                    <span className="font-medium text-slate-200">{status.name}</span>
                                                                </td>
                                                                <td className="py-3 px-4 text-right">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleEdit(status)}
                                                                            className="text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 h-8 w-8"
                                                                        >
                                                                            <Edit2 className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleDelete(status.id)}
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
                                            {statuses.last_page > 1 && (
                                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                                                    <div className="text-sm text-slate-400">
                                                        Showing {statuses.from} to {statuses.to} of {statuses.total} statuses
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.get(route('admin.task-statuses.index'), { page: statuses.current_page - 1, search: searchQuery })}
                                                            disabled={statuses.current_page === 1}
                                                            className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                                        >
                                                            Previous
                                                        </Button>
                                                        <span className="text-sm text-slate-400">
                                                            Page {statuses.current_page} of {statuses.last_page}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.get(route('admin.task-statuses.index'), { page: statuses.current_page + 1, search: searchQuery })}
                                                            disabled={statuses.current_page === statuses.last_page}
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
