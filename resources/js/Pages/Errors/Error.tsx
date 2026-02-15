import { Head } from '@inertiajs/react';
import { 
    AlertCircle, 
    Lock, 
    Search, 
    Server, 
    Clock,
    ShieldAlert,
    AlertTriangle
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';

interface Props {
    status: number;
}

export default function Error({ status }: Props) {
    const getErrorContent = () => {
        switch (status) {
            case 401:
                return {
                    icon: Lock,
                    title: 'Unauthorized',
                    description: 'Sorry, you need to login to access this page.',
                    color: 'text-amber-400',
                    bgColor: 'bg-amber-500/10',
                    borderColor: 'border-amber-500/20',
                    numberColor: 'from-amber-500/20 to-amber-600/5',
                    numberText: 'text-amber-200',
                };
            case 403:
                return {
                    icon: ShieldAlert,
                    title: 'Forbidden',
                    description: 'Sorry, you are not authorized to access this page.',
                    color: 'text-rose-400',
                    bgColor: 'bg-rose-500/10',
                    borderColor: 'border-rose-500/20',
                    numberColor: 'from-rose-500/20 to-rose-600/5',
                    numberText: 'text-rose-200',
                };
            case 404:
                return {
                    icon: Search,
                    title: 'Page Not Found',
                    description: 'Sorry, the page you are looking for could not be found.',
                    color: 'text-indigo-400',
                    bgColor: 'bg-indigo-500/10',
                    borderColor: 'border-indigo-500/20',
                    numberColor: 'from-indigo-500/20 to-indigo-600/5',
                    numberText: 'text-indigo-200',
                };
            case 419:
                return {
                    icon: Clock,
                    title: 'Page Expired',
                    description: 'Sorry, your session has expired. Please refresh and try again.',
                    color: 'text-amber-400',
                    bgColor: 'bg-amber-500/10',
                    borderColor: 'border-amber-500/20',
                    numberColor: 'from-amber-500/20 to-amber-600/5',
                    numberText: 'text-amber-200',
                };
            case 429:
                return {
                    icon: AlertTriangle,
                    title: 'Too Many Requests',
                    description: 'Sorry, you are making too many requests. Please slow down.',
                    color: 'text-orange-400',
                    bgColor: 'bg-orange-500/10',
                    borderColor: 'border-orange-500/20',
                    numberColor: 'from-orange-500/20 to-orange-600/5',
                    numberText: 'text-orange-200',
                };
            case 500:
                return {
                    icon: Server,
                    title: 'Server Error',
                    description: 'Whoops, something went wrong on our servers.',
                    color: 'text-rose-400',
                    bgColor: 'bg-rose-500/10',
                    borderColor: 'border-rose-500/20',
                    numberColor: 'from-rose-500/20 to-rose-600/5',
                    numberText: 'text-rose-200',
                };
            case 503:
                return {
                    icon: AlertCircle,
                    title: 'Service Unavailable',
                    description: 'Sorry, we are doing some maintenance. Please check back soon.',
                    color: 'text-slate-400',
                    bgColor: 'bg-slate-500/10',
                    borderColor: 'border-slate-500/20',
                    numberColor: 'from-slate-500/20 to-slate-600/5',
                    numberText: 'text-slate-200',
                };
            default:
                return {
                    icon: AlertCircle,
                    title: 'Error',
                    description: 'An unexpected error occurred.',
                    color: 'text-slate-400',
                    bgColor: 'bg-slate-500/10',
                    borderColor: 'border-slate-500/20',
                    numberColor: 'from-slate-500/20 to-slate-600/5',
                    numberText: 'text-slate-200',
                };
        }
    };

    const content = getErrorContent();
    const Icon = content.icon;

    return (
        <>
            <Head title={content.title} />
            
            <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    {/* Error Code - Now Visible with Gradient Background */}
                    <div className="mb-8 relative">
                        {/* Background gradient glow */}
                        <div className={`absolute inset-0 bg-gradient-to-b ${content.numberColor} blur-3xl opacity-60`} />
                        
                        {/* The number */}
                        <span className={`relative text-9xl font-black ${content.numberText} select-none drop-shadow-2xl`}>
                            {status}
                        </span>
                    </div>

                    {/* Icon Card */}
                    <div className={`
                        relative mx-auto mb-6 
                        w-24 h-24 rounded-2xl 
                        ${content.bgColor} 
                        ${content.borderColor}
                        border-2
                        flex items-center justify-center
                    `}>
                        <Icon className={`w-12 h-12 ${content.color}`} />
                        
                        {/* Glow effect */}
                        <div className={`
                            absolute inset-0 rounded-2xl 
                            ${content.bgColor} 
                            blur-xl opacity-50 -z-10
                        `} />
                    </div>

                    {/* Title */}
                    <h1 className={`text-2xl font-bold mb-3 ${content.color}`}>
                        {content.title}
                    </h1>

                    {/* Description */}
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        {content.description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        
                        {status === 419 && (
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="bg-indigo-600 text-white"
                            >
                                Refresh Page
                            </Button>
                        )}
                        
                        {status !== 419 && (
                            <Button
                                variant="outline"
                                asChild
                               className="bg-indigo-600 text-white"
                            >
                                <Link href={route('dashboard')}>
                                    Go Back
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-8 border-t border-slate-800/50">
                        <p className="text-sm text-slate-500">
                            If you believe this is a mistake, please contact support.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}