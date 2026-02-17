import type { User, Role, Department } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { 
    Search,
    User as UserIcon,
    Shield,
    Building2,
    Edit2,
    Plus,
    Save,
    Loader2,
    Check,
    Upload,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { PaginatedResponse , SearchFilter} from '@/types/index';
import InputLabel from '@/Components/InputLabel';
import UserAvatar from '@/Components/UserAvatar';

interface IndexProps {
    allRoles: Role[];
    allDepartments: Department[];
    filters: SearchFilter;
    users: PaginatedResponse<User>;
}

export default function Index({ users, filters, allRoles, allDepartments }: IndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search);
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [showDeptDropdown, setShowDeptDropdown] = useState(false);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        profile_picture: null as File | null,
        roles: [] as number[],
        departments: [] as number[],
    });

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        router.get(route('admin.user-management.index'), { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleRoleToggle = (roleId: number) => {
        const newRoles = data.roles.includes(roleId)
            ? data.roles.filter(id => id !== roleId)
            : [...data.roles, roleId];
        setData('roles', newRoles);
    };

    const handleDepartmentToggle = (departmentId: number) => {
        const newDepartments = data.departments.includes(departmentId)
            ? data.departments.filter(id => id !== departmentId)
            : [...data.departments, departmentId];
        setData('departments', newDepartments);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.user-management.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setData('roles', []);
                setData('departments', []);
                setProfilePicturePreview(null);
            },
        });
    };

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_picture', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePicturePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveProfilePicture = () => {
        setData('profile_picture', null);
        setProfilePicturePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        User Management
                    </h2>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-slate-400">
                            {users.total} {users.total === 1 ? 'User' : 'Users'}
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="User Management" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex gap-6">
                        {/* Left Side - Create User Form */}
                        <div className="w-96 flex-shrink-0">
                            <Card className="bg-[#0f0f10] border-slate-800/50 shadow-xl sticky top-8">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-indigo-400" />
                                        Create New User
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid gap-2">
                                            <InputLabel htmlFor="name" className="text-slate-300">Name</InputLabel>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                                placeholder="Enter name"
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-400">{errors.name}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <InputLabel htmlFor="email" className="text-slate-300">Email</InputLabel>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                                placeholder="Enter email"
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-400">{errors.email}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <InputLabel htmlFor="password" className="text-slate-300">Password</InputLabel>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                                placeholder="Enter password"
                                            />
                                            {errors.password && (
                                                <p className="text-sm text-red-400">{errors.password}</p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <InputLabel htmlFor="password_confirmation" className="text-slate-300">Confirm Password</InputLabel>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                                placeholder="Confirm password"
                                            />
                                        </div>

                                        {/* Profile Picture Upload */}
                                        <div className="grid gap-2">
                                            <InputLabel className="text-slate-300">Profile Picture (Optional)</InputLabel>
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    {profilePicturePreview ? (
                                                        <div className="relative">
                                                            <img
                                                                src={profilePicturePreview}
                                                                alt="Profile preview"
                                                                className="w-16 h-16 rounded-full object-cover border-2 border-slate-700"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={handleRemoveProfilePicture}
                                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 transition-colors"
                                                            >
                                                                <X className="w-3 h-3 text-white" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center">
                                                            <UserIcon className="w-6 h-6 text-slate-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleProfilePictureChange}
                                                        className="hidden"
                                                        id="profile_picture"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white gap-2"
                                                    >
                                                        <Upload className="w-4 h-4" />
                                                        Upload Image
                                                    </Button>
                                                    <p className="text-xs text-slate-500 mt-1">Max 2MB, JPG/PNG/GIF</p>
                                                </div>
                                            </div>
                                            {errors.profile_picture && (
                                                <p className="text-sm text-red-400">{errors.profile_picture}</p>
                                            )}
                                        </div>

                                        {/* Roles Dropdown */}
                                        <div className="grid gap-2">
                                            <InputLabel className="text-slate-300">Roles (Optional)</InputLabel>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                                                    className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-slate-900/50 border border-slate-800 text-slate-200 hover:border-slate-700 transition-colors"
                                                >
                                                    <span className="text-sm">
                                                        {data.roles.length > 0 
                                                            ? `${data.roles.length} role${data.roles.length > 1 ? 's' : ''} selected`
                                                            : 'Select roles'}
                                                    </span>
                                                    <Shield className="w-4 h-4 text-slate-400" />
                                                </button>
                                                {showRoleDropdown && (
                                                    <div className="absolute z-10 mt-1 w-full bg-slate-900 border border-slate-800 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                                        {allRoles.length === 0 ? (
                                                            <div className="px-3 py-2 text-slate-500 text-sm">No roles available</div>
                                                        ) : (
                                                            allRoles.map((role) => {
                                                                const isSelected = data.roles.includes(role.id);
                                                                return (
                                                                    <div
                                                                        key={role.id}
                                                                        onClick={() => handleRoleToggle(role.id)}
                                                                        className={cn(
                                                                            "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-800/50 transition-colors",
                                                                            isSelected && "bg-indigo-500/10"
                                                                        )}
                                                                    >
                                                                        <div className={cn(
                                                                            "w-4 h-4 rounded border flex items-center justify-center",
                                                                            isSelected ? "border-indigo-500 bg-indigo-500" : "border-slate-600"
                                                                        )}>
                                                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                                                        </div>
                                                                        <span className="text-sm text-slate-200">{role.name}</span>
                                                                    </div>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Departments Dropdown */}
                                        <div className="grid gap-2">
                                            <InputLabel className="text-slate-300">Departments (Optional)</InputLabel>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDeptDropdown(!showDeptDropdown)}
                                                    className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-slate-900/50 border border-slate-800 text-slate-200 hover:border-slate-700 transition-colors"
                                                >
                                                    <span className="text-sm">
                                                        {data.departments.length > 0 
                                                            ? `${data.departments.length} dept${data.departments.length > 1 ? 's' : ''} selected`
                                                            : 'Select departments'}
                                                    </span>
                                                    <Building2 className="w-4 h-4 text-slate-400" />
                                                </button>
                                                {showDeptDropdown && (
                                                    <div className="absolute z-10 mt-1 w-full bg-slate-900 border border-slate-800 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                                        {allDepartments.length === 0 ? (
                                                            <div className="px-3 py-2 text-slate-500 text-sm">No departments available</div>
                                                        ) : (
                                                            allDepartments.map((dept) => {
                                                                const isSelected = data.departments.includes(dept.id);
                                                                return (
                                                                    <div
                                                                        key={dept.id}
                                                                        onClick={() => handleDepartmentToggle(dept.id)}
                                                                        className={cn(
                                                                            "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-800/50 transition-colors",
                                                                            isSelected && "bg-emerald-500/10"
                                                                        )}
                                                                    >
                                                                        <div className={cn(
                                                                            "w-4 h-4 rounded border flex items-center justify-center",
                                                                            isSelected ? "border-emerald-500 bg-emerald-500" : "border-slate-600"
                                                                        )}>
                                                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                                                        </div>
                                                                        <span className="text-sm text-slate-200">{dept.name}</span>
                                                                    </div>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
                                        >
                                            {processing ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Plus className="w-4 h-4" />
                                            )}
                                            Create User
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Side - Users Table */}
                        <div className="flex-1 min-w-0">
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
                                                {searchQuery ? 'Try a different search term' : 'Create your first user using the form on the left'}
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
                                                                        <UserAvatar user={user} size="md" />
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
