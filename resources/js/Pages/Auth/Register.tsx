import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { 
    User, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff,
    ArrowRight,
    Loader2,
    CheckCircle2
} from 'lucide-react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Password strength indicator
    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(data.password);
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-400'];

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
                        Create your account
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Join thousands of teams managing projects efficiently
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <InputLabel 
                            htmlFor="name" 
                            value="Full Name"
                            className="text-sm font-medium text-slate-300"
                        />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-500" />
                            </div>
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="pl-11 w-full bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl transition-all"
                                placeholder="John Doe"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.name} className="text-rose-400 text-sm" />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <InputLabel 
                            htmlFor="email" 
                            value="Email address"
                            className="text-sm font-medium text-slate-300"
                        />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-500" />
                            </div>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="pl-11 w-full bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl transition-all"
                                placeholder="you@example.com"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.email} className="text-rose-400 text-sm" />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <InputLabel 
                            htmlFor="password" 
                            value="Password"
                            className="text-sm font-medium text-slate-300"
                        />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500" />
                            </div>
                            <TextInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                className="pl-11 pr-12 w-full bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl transition-all"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {data.password && (
                            <div className="mt-2">
                                <div className="flex gap-1 h-1.5 mb-1">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className={`flex-1 rounded-full transition-all duration-300 ${
                                                level <= passwordStrength 
                                                    ? strengthColors[passwordStrength - 1] 
                                                    : 'bg-slate-700'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className={`text-xs ${
                                    passwordStrength > 0 ? 'text-slate-400' : 'text-slate-600'
                                }`}>
                                    {passwordStrength > 0 && `Password strength: ${strengthLabels[passwordStrength - 1]}`}
                                </p>
                            </div>
                        )}
                        
                        <InputError message={errors.password} className="text-rose-400 text-sm" />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <InputLabel 
                            htmlFor="password_confirmation" 
                            value="Confirm Password"
                            className="text-sm font-medium text-slate-300"
                        />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500" />
                            </div>
                            <TextInput
                                id="password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="pl-11 pr-12 w-full bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl transition-all"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        
                        {/* Password Match Indicator */}
                        {data.password_confirmation && (
                            <div className="flex items-center gap-2 mt-1">
                                {data.password === data.password_confirmation ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span className="text-xs text-emerald-500">Passwords match</span>
                                    </>
                                ) : (
                                    <span className="text-xs text-amber-500">Passwords do not match</span>
                                )}
                            </div>
                        )}
                        
                        <InputError message={errors.password_confirmation} className="text-rose-400 text-sm" />
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="terms"
                            className="mt-1 w-4 h-4 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500/20 bg-slate-900/50"
                            required
                        />
                        <label htmlFor="terms" className="text-sm text-slate-400 leading-relaxed">
                            I agree to the{' '}
                            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Privacy Policy</a>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <PrimaryButton 
                        className="w-full justify-center py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group mt-6"
                        disabled={processing}
                    >
                        {processing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Create Account
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </PrimaryButton>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#0f0f10] text-slate-500">
                                Or sign up with
                            </span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            GitHub
                        </button>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-sm text-slate-500 pt-4">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </GuestLayout>
    );
}