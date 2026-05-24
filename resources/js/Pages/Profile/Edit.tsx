import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Profile Settings
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-[#0f0f10] border border-slate-800/50 p-6 shadow sm:rounded-lg">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </div>

                            <div className="bg-[#0f0f10] border border-slate-800/50 p-6 shadow sm:rounded-lg">
                                <UpdatePasswordForm />
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-[#0f0f10] border border-slate-800/50 p-6 shadow sm:rounded-lg">
                                <DeleteUserForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
