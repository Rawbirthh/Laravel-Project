import type { User, Role, Department } from '@/types/User';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    User as UserIcon,
    Shield,
    Building2,
    Save,
    Loader2,
    ArrowLeft,
    Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

interface EditProps {
    user: User;
    allRoles: Role[];
    allDepartments: Department[];
}

export default function Edit({ user, allRoles, allDepartments }: EditProps) {
    const [activeTab, setActiveTab] = useState('roles');
    const [selectedRoles, setSelectedRoles] = useState<number[]>(
        user.roles?.map(r => r.id) || []
    );
    const [selectedDepartments, setSelectedDepartments] = useState<number[]>(
        user.departments?.map(d => d.id) || []
    );

    const { post, processing } = useForm({
        roles: selectedRoles,
        departments: selectedDepartments,
    });

    const handleRoleToggle = (roleId: number) => {
        setSelectedRoles(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    const handleDepartmentToggle = (departmentId: number) => {
        setSelectedDepartments(prev =>
            prev.includes(departmentId)
                ? prev.filter(id => id !== departmentId)
                : [...prev, departmentId]
        );
    };

    const handleSaveRoles = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('admin.user-management.update-roles', user.id), {
            roles: selectedRoles,
        });
    };

    const handleSaveDepartments = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('admin.user-management.update-departments', user.id), {
            departments: selectedDepartments,
        });
    };

    const handleSaveAll = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('admin.user-management.update-all', user.id), {
            roles: selectedRoles,
            departments: selectedDepartments,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.get(route('admin.user-management.index'))}
                            className="text-slate-400 hover:text-white hover:bg-slate-800/50"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h2 className="text-xl font-semibold text-white tracking-tight">
                            Manage User: {user.name}
                        </h2>
                    </div>
                    <Button
                        onClick={handleSaveAll}
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
                    >
                        {processing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Save All Changes
                    </Button>
                </div>
            }
        >
            <Head title={`Manage ${user.name}`} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* User Info Card */}
                    <Card className="bg-[#0f0f10] border-slate-800/50 shadow-xl mb-6">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                    <UserIcon className="w-8 h-8 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                                    <p className="text-slate-400">{user.email}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-6">
                        <Button
                            variant={activeTab === 'roles' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('roles')}
                            className={activeTab === 'roles' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-800/50 hover:text-white hover:bg-slate-800/50 hover:text-white'}
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            Roles
                        </Button>
                        <Button
                            variant={activeTab === 'departments' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('departments')}
                            className={activeTab === 'departments' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800/50 hover:text-white hover:bg-slate-800/50'}
                        >
                            <Building2 className="w-4 h-4 mr-2" />
                            Departments
                        </Button>
                    </div>

                    {/* Roles Tab Content */}
                    {activeTab === 'roles' && (
                        <Card className="bg-[#0f0f10] border-slate-800/50 shadow-xl">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-indigo-400" />
                                        User Roles
                                    </CardTitle>
                                    <form onSubmit={handleSaveRoles}>
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
                                            Save Roles
                                        </Button>
                                    </form>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {allRoles.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Shield className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                                        <p className="text-slate-500">No roles available</p>
                                        <p className="text-slate-600 text-sm mt-1">Create roles first to assign them to users</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {allRoles.map((role) => {
                                            const isSelected = selectedRoles.includes(role.id);
                                            return (
                                                <div
                                                    key={role.id}
                                                    onClick={() => handleRoleToggle(role.id)}
                                                    className={cn(
                                                        "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200",
                                                        isSelected
                                                            ? "border-indigo-500/50 bg-indigo-500/10"
                                                            : "border-slate-800/50 bg-slate-900/30 hover:bg-slate-800/30 hover:border-slate-700/50"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                                            isSelected
                                                                ? "border-indigo-500 bg-indigo-500"
                                                                : "border-slate-600"
                                                        )}>
                                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-slate-200">{role.name}</h4>
                                                            <p className="text-sm text-slate-400">Code: {role.code}</p>
                                                        </div>
                                                    </div>
                                                    <span className={cn(
                                                        "px-2 py-1 rounded text-xs font-medium",
                                                        isSelected
                                                            ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                                                            : "bg-slate-800/50 text-slate-500 border border-slate-700/50"
                                                    )}>
                                                        {role.slug}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Departments Tab Content */}
                    {activeTab === 'departments' && (
                        <Card className="bg-[#0f0f10] border-slate-800/50 shadow-xl">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-emerald-400" />
                                        User Departments
                                    </CardTitle>
                                    <form onSubmit={handleSaveDepartments}>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2"
                                        >
                                            {processing ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            Save Departments
                                        </Button>
                                    </form>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {allDepartments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Building2 className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                                        <p className="text-slate-500">No departments available</p>
                                        <p className="text-slate-600 text-sm mt-1">Create departments first to assign them to users</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {allDepartments.map((dept) => {
                                            const isSelected = selectedDepartments.includes(dept.id);
                                            return (
                                                <div
                                                    key={dept.id}
                                                    onClick={() => handleDepartmentToggle(dept.id)}
                                                    className={cn(
                                                        "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200",
                                                        isSelected
                                                            ? "border-emerald-500/50 bg-emerald-500/10"
                                                            : "border-slate-800/50 bg-slate-900/30 hover:bg-slate-800/30 hover:border-slate-700/50"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                                            isSelected
                                                                ? "border-emerald-500 bg-emerald-500"
                                                                : "border-slate-600"
                                                        )}>
                                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-slate-200">{dept.name}</h4>
                                                            <p className="text-sm text-slate-400">Code: {dept.code}</p>
                                                        </div>
                                                    </div>
                                                    <span className={cn(
                                                        "px-2 py-1 rounded text-xs font-medium",
                                                        isSelected
                                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                            : "bg-slate-800/50 text-slate-500 border border-slate-700/50"
                                                    )}>
                                                        {dept.slug}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
