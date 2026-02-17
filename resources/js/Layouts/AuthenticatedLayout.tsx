import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useEffect } from 'react';
import { ToastProvider, useToast } from '@/components/ui/toast-provider';
import { Sidebar } from '@/components/Sidebar';
import NotificationBell from '@/Components/NotificationBell';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    return (
        <ToastProvider>
            <AuthenticatedInner header={header}>
                {children}
            </AuthenticatedInner>
        </ToastProvider>
    );
}

function AuthenticatedInner({
    header,
    children,
}: {
    header?: ReactNode;
    children: ReactNode;
}) {
    const page = usePage();
    const { showToast } = useToast();

    useEffect(() => {
        const flash = page.props.flash as any;
        if (flash?.success) {
            showToast(flash.success, 'success');
        }
        if (flash?.error) {
            showToast(flash.error, 'error');
        }
    }, [page.props, showToast]);

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-slate-200">
            <Sidebar />
            <div className="ml-64 transition-all duration-300">
                {header && (
                    <header className="bg-[#0f0f10] border-b border-slate-800/50 shadow-sm">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
                            {header}
                            <NotificationBell />
                        </div>
                    </header>
                )}
                <main className="p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}