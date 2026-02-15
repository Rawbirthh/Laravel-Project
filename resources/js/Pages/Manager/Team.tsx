import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Users, Mail, Building2, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

export default function ManagerTeam({ users }: { users: any[] }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        Team Members
                    </h2>
                </div>
            }
        >
            <Head title="Team Members" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="bg-[#0f0f10] border-slate-800/50">
                        <CardHeader>
                            <CardTitle className="text-white">All Team Members</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {users.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                                        <Users className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <p className="text-slate-500 text-lg">No team members yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {users.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                                                    <span className="text-white font-medium text-lg">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-200">{user.name}</p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                {user.roles && user.roles.length > 0 ? (
                                                    user.roles.map((role: any) => (
                                                        <span
                                                            key={role.id}
                                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                                                                role.slug === 'admin'
                                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                                    : role.slug === 'manage'
                                                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                                                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                                                            }`}
                                                        >
                                                            <Shield className="w-3 h-3 mr-1" />
                                                            {role.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/30">
                                                        User
                                                    </span>
                                                )}
                                                {user.departments && user.departments.length > 0 && (
                                                    user.departments.map((dept: any) => (
                                                        <span
                                                            key={dept.id}
                                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                                        >
                                                            <Building2 className="w-3 h-3 mr-1" />
                                                            {dept.name}
                                                        </span>
                                                    ))
                                                )}
                                            </div>
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
