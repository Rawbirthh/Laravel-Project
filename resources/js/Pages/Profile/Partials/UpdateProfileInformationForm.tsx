import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import UserAvatar from '@/Components/UserAvatar';
import { Dialog, DialogContent } from '@/Components/ui/dialog';
import { Textarea } from '@/Components/ui/textarea';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, recentlySuccessful, transform } = useForm({
        _method: 'patch',
        name: user.name,
        email: user.email,
        bio: user.bio ?? '',
        profile_picture: null as File | null,
    });

    transform((formData) => {
        if (!formData.profile_picture) {
            const { profile_picture, ...rest } = formData;
            return rest;
        }
        return formData;
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setData('profile_picture', file);
        }
    };

    const handleRemovePicture = () => {
        setPreview(null);
        setData('profile_picture', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setPreview(null);
            },
        });
    };

    const avatarUrl = preview || user.profile_picture_url;

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-white">
                    Profile Information
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <button
                            type="button"
                            onClick={() => !preview && user.profile_picture_url && setShowPreview(true)}
                            className="w-28 h-28 rounded-full overflow-hidden ring-2 ring-slate-700 hover:ring-indigo-500/50 transition-all block"
                        >
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <UserAvatar user={user} size="xl" className="w-full h-full" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 border-2 border-[#0f0f10] transition-colors cursor-pointer"
                        >
                            <Camera className="w-4 h-4 text-white" />
                        </button>
                        {data.profile_picture && (
                            <button
                                type="button"
                                onClick={handleRemovePicture}
                                className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5"
                            >
                                <X className="w-3.5 h-3.5 text-white" />
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-white">{user.name}</p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs text-indigo-400 hover:text-indigo-300 mt-1"
                        >
                            Change photo
                        </button>
                    </div>
                </div>

                {errors.profile_picture && (
                    <p className="text-sm text-red-400">{errors.profile_picture}</p>
                )}

                <div>
                    <InputLabel htmlFor="name" value="Name" className="text-slate-300" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-slate-300" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="bio" value="Bio" className="text-slate-300" />
                    <Textarea
                        id="bio"
                        rows={3}
                        className="mt-1 block w-full bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        placeholder="Tell us about yourself..."
                        maxLength={500}
                    />
                    <div className="flex justify-between mt-1">
                        {errors.bio && <InputError message={errors.bio} />}
                        <span className="text-xs text-slate-500 ml-auto">{data.bio.length}/500</span>
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-slate-300">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-indigo-400 underline hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-slate-400">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>

            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-lg bg-transparent border-none shadow-none">
                    <button
                        onClick={() => setShowPreview(false)}
                        className="absolute -top-10 right-0 text-white/80 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <img
                        src={avatarUrl}
                        alt={user.name}
                        className="w-full rounded-lg"
                    />
                </DialogContent>
            </Dialog>
        </section>
    );
}