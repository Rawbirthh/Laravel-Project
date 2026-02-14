import type { Todo } from '@/types/Todo';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Plus, 
    Trash2, 
    Edit2, 
    CheckCircle2, 
    Circle, 
    X,
    Save,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Index({ todos }: { todos: Todo[] }) {
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const { data, setData, post, put, delete: destroy, errors, reset, processing } = useForm({
        title: '',
        description: '',
        completed: false,
    });

    const completedCount = todos.filter(t => t.completed).length;
    const pendingCount = todos.length - completedCount;

    const handleCreate = () => {
        setIsCreating(true);
        setEditingTodo(null);
        reset();
    };

    const handleEdit = (todo: Todo) => {
        setEditingTodo(todo);
        setIsCreating(false);
        setData({
            title: todo.title,
            description: todo.description || '',
            completed: todo.completed,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTodo) {
            put(route('todos.update', editingTodo.id), {
                onSuccess: () => {
                    setEditingTodo(null);
                    reset();
                },
            });
        } else {
            post(route('todos.store'), {
                onSuccess: () => {
                    reset();
                    setIsCreating(false);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this todo?')) {
            destroy(route('todos.destroy', id), {
                onSuccess: () => {
                    if (editingTodo?.id === id) {
                        setEditingTodo(null);
                        reset();
                    }
                },
            });
        }
    };

    const handleCancel = () => {
        setEditingTodo(null);
        setIsCreating(false);
        reset();
    };

    const toggleComplete = (todo: Todo) => {
        router.put(route('todos.update', todo.id), {
            title: todo.title,
            description: todo.description || '',
            completed: !todo.completed,
        }, {
            preserveScroll: true,
        });
    };


    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        Todos
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-0">
                                {completedCount} Done
                            </Badge>
                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-0">
                                {pendingCount} Pending
                            </Badge>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Todos" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    
                    {/* Create Button */}
                    {!isCreating && !editingTodo && (
                        <div className="mb-6">
                            <Button
                                onClick={handleCreate}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create Todo
                            </Button>
                        </div>
                    )}

                    {/* Form */}
                    {(isCreating || editingTodo) && (
                        <Card className="mb-6 bg-[#0f0f10] border-slate-800/50 shadow-xl">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                        {editingTodo ? (
                                            <>
                                                <Edit2 className="w-5 h-5 text-indigo-400" />
                                                Edit Todo
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-5 h-5 text-indigo-400" />
                                                Create New Todo
                                            </>
                                        )}
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleCancel}
                                        className="text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="title"
                                            className="block text-sm font-medium text-slate-300 mb-1.5"
                                        >
                                            Title
                                        </label>
                                        <Input
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData('title', e.target.value)
                                            }
                                            placeholder="What needs to be done?"
                                            className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                        />
                                        {errors.title && (
                                            <p className="mt-1.5 text-sm text-rose-400">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-slate-300 mb-1.5"
                                        >
                                            Description
                                        </label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData('description', e.target.value)
                                            }
                                            placeholder="Add details (optional)"
                                            rows={3}
                                            className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 resize-none"
                                        />
                                        {errors.description && (
                                            <p className="mt-1.5 text-sm text-rose-400">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 py-2">
                                        <Checkbox
                                            id="completed"
                                            checked={data.completed}
                                            onCheckedChange={(checked) =>
                                                setData('completed', checked as boolean)
                                            }
                                            className="border-slate-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                        />
                                        <label
                                            htmlFor="completed"
                                            className="text-sm text-slate-300 cursor-pointer select-none"
                                        >
                                            Mark as completed
                                        </label>
                                    </div>

                                    <Separator className="bg-slate-800/50" />

                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
                                        >
                                            {processing ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            {editingTodo ? 'Update' : 'Create'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                            className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* Todo List */}
                    <Card className="bg-[#0f0f10] border-slate-800/50 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                                Your Tasks
                                <span className="text-sm font-normal text-slate-500 ml-2">
                                    ({todos.length})
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {todos.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                                        <CheckCircle2 className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <p className="text-slate-500 text-lg">No todos yet</p>
                                    <p className="text-slate-600 text-sm mt-1">Create your first task to get started</p>
                                </div>
                            ) : (
                                <ul className="space-y-2">
                                    {todos.map((todo) => (
                                        <li
                                            key={todo.id}
                                            className={cn(
                                                "group flex items-center justify-between rounded-xl border p-4 transition-all duration-200",
                                                editingTodo?.id === todo.id
                                                    ? "border-indigo-500/50 bg-indigo-500/10"
                                                    : "border-slate-800/50 bg-slate-900/30 hover:bg-slate-800/30 hover:border-slate-700/50"
                                            )}
                                        >
                                            <div className="flex flex-1 items-center gap-4">
                                                <button
                                                    onClick={() => toggleComplete(todo)}
                                                    className={cn(
                                                        "flex-shrink-0 transition-colors",
                                                        todo.completed ? "text-emerald-400" : "text-slate-600 hover:text-slate-400"
                                                    )}
                                                >
                                                    {todo.completed ? (
                                                        <CheckCircle2 className="w-6 h-6" />
                                                    ) : (
                                                        <Circle className="w-6 h-6" />
                                                    )}
                                                </button>
                                                <div 
                                                    className="flex-1 cursor-pointer"
                                                    onClick={() => handleEdit(todo)}
                                                >
                                                    <h3
                                                        className={cn(
                                                            "font-medium transition-all",
                                                            todo.completed
                                                                ? 'text-slate-500 line-through'
                                                                : 'text-slate-200'
                                                        )}
                                                    >
                                                        {todo.title}
                                                    </h3>
                                                    {todo.description && (
                                                        <p className={cn(
                                                            "text-sm mt-0.5 line-clamp-2",
                                                            todo.completed ? 'text-slate-600' : 'text-slate-400'
                                                        )}>
                                                            {todo.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(todo)}
                                                    className="text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 h-8 w-8"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(todo.id)}
                                                    className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}