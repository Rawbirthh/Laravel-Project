import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Users, Shield, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard({ users }: { users: any[] }) {
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
                                <p className="text-3xl font-bold text-white">{users.length}</p>
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
                                    {users.filter((u) => u.roles?.some((r: any) => r.slug === 'admin')).length}
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
                                    {users.filter((u) => !u.roles?.some((r: any) => r.slug === 'admin')).length}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-[#0f0f10] border-slate-800/50">
                        <CardHeader>
                            <CardTitle className="text-white">All Users</CardTitle>
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
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-b border-slate-800/30">
                                                <td className="py-3 px-4 text-slate-200">{user.name}</td>
                                                <td className="py-3 px-4 text-slate-400 flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    {user.email}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {user.roles?.some((r: any) => r.slug === 'admin') ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                                            <Shield className="w-3 h-3 mr-1" />
                                                            Admin
                                                        </span>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
