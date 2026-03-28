import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Plus, 
    Trash2, 
    Edit2, 
    Flag,
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
import { TaskPriority } from '@/types/Task';


interface TaskPriorityFormData {
    name: string;
}

interface IndexProps {
    priorities: PaginatedResponse<TaskPriority>;
    filters: SearchFilter;
}

export default function Index({ priorities, filters }: IndexProps) {
    const [editingPriority, setEditingPriority] = useState<TaskPriority | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search);

    const { data, setData, post, put, delete: destroy, errors, reset, processing } = useForm<TaskPriorityFormData>({
        name: '',
    });

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        router.get(route('admin.task-priorities.index'), { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCreate = () => {
        setIsCreating(true);
        setEditingPriority(null);
        reset();
    };

    const handleEdit = (priority: TaskPriority) => {
        setEditingPriority(priority);
        setIsCreating(false);
        setData({
            name: priority.name,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPriority) {
            put(route('admin.task-priorities.update', editingPriority.id), {
                onSuccess: () => {
                    setEditingPriority(null);
                    reset();
                },
            });
        } else {
            post(route('admin.task-priorities.store'), {
                onSuccess: () => {
                    reset();
                    setIsCreating(false);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this task priority?')) {
            destroy(route('admin.task-priorities.destroy', id), {
                onSuccess: () => {
                    if (editingPriority?.id === id) {
                        setEditingPriority(null);
                        reset();
                    }
                },
            });
        }
    };

    const handleCancel = () => {
        setEditingPriority(null);
        setIsCreating(false);
        reset();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        Task Priorities
                    </h2>
                    <div className="flex items-center gap-4">
                    </div>
                </div>
            }
        >
            <Head title="Task Priorities" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Form */}
                        <div className="lg:col-span-1">
                            <Card className="bg-[#0f0f10] border-slate-800/50 shadow-xl sticky top-4">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                        {editingPriority ? (
                                            <>
                                                <Edit2 className="w-5 h-5 text-indigo-400" />
                                                Edit Priority
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-5 h-5 text-indigo-400" />
                                                {isCreating ? 'Create New Priority' : 'Add Priority'}
                                            </>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!isCreating && !editingPriority ? (
                                        <Button
                                            onClick={handleCreate}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Create Priority
                                        </Button>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <label
                                                    htmlFor="name"
                                                    className="block text-sm font-medium text-slate-300 mb-1.5"
                                                >
                                                    Priority Name
                                                </label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData('name', e.target.value)
                                                    }
                                                    placeholder="e.g., High, Medium, Low"
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
                                                    {editingPriority ? 'Update' : 'Create'}
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
                                            <Flag className="w-5 h-5 text-indigo-400" />
                                            All Priorities ({priorities.total})
                                        </CardTitle>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                type="text"
                                                placeholder="Search priorities..."
                                                value={searchQuery}
                                                onChange={(e) => handleSearch(e.target.value)}
                                                className="pl-9 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 w-64"
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {priorities.data.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                                                <Flag className="w-8 h-8 text-slate-600" />
                                            </div>
                                            <p className="text-slate-500 text-lg">
                                                {searchQuery ? 'No priorities found' : 'No priorities yet'}
                                            </p>
                                            <p className="text-slate-600 text-sm mt-1">
                                                {searchQuery ? 'Try a different search term' : 'Create your first priority to get started'}
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
                                                        {priorities.data.map((priority) => (
                                                            <tr
                                                                key={priority.id}
                                                                className={cn(
                                                                    "border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors",
                                                                    editingPriority?.id === priority.id && "bg-indigo-500/10"
                                                                )}
                                                            >
                                                                <td className="py-3 px-4">
                                                                    <span className="font-medium text-slate-200">{priority.name}</span>
                                                                </td>
                                                                <td className="py-3 px-4 text-right">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleEdit(priority)}
                                                                            className="text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 h-8 w-8"
                                                                        >
                                                                            <Edit2 className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleDelete(priority.id)}
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
                                            {priorities.last_page > 1 && (
                                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                                                    <div className="text-sm text-slate-400">
                                                        Showing {priorities.from} to {priorities.to} of {priorities.total} priorities
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.get(route('admin.task-priorities.index'), { page: priorities.current_page - 1, search: searchQuery })}
                                                            disabled={priorities.current_page === 1}
                                                            className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                                        >
                                                            Previous
                                                        </Button>
                                                        <span className="text-sm text-slate-400">
                                                            Page {priorities.current_page} of {priorities.last_page}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.get(route('admin.task-priorities.index'), { page: priorities.current_page + 1, search: searchQuery })}
                                                            disabled={priorities.current_page === priorities.last_page}
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
