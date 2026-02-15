import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { CheckSquare, Calendar, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmployeeDashboard({ todos }: { todos: any[] }) {
    const pendingTodos = todos.filter((t) => !t.completed).length;
    const completedTodos = todos.filter((t) => t.completed).length;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        Employee Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Employee Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CheckSquare className="w-5 h-5 text-indigo-400" />
                                    Total Tasks
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-white">{todos.length}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-amber-400" />
                                    Pending
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-white">{pendingTodos}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                    Completed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-white">{completedTodos}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#0f0f10] border-slate-800/50">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-400" />
                                    Today
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-white">
                                    {new Date().toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-[#0f0f10] border-slate-800/50">
                        <CardHeader>
                            <CardTitle className="text-white">Recent Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {todos.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                                        <CheckSquare className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <p className="text-slate-500 text-lg">No tasks yet</p>
                                    <p className="text-slate-600 text-sm mt-1">Create your first task to get started</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {todos.slice(0, 5).map((todo) => (
                                        <div
                                            key={todo.id}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-colors"
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
                                                {todo.description && (
                                                    <p className="text-xs text-slate-500 mt-1">{todo.description}</p>
                                                )}
                                            </div>
                                            <span className="text-xs text-slate-500">
                                                {new Date(todo.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
