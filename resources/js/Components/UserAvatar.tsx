import { User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
    user: {
        name: string;
        profile_picture_url?: string;
    };
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
};

const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
};

export default function UserAvatar({ user, size = 'md', className }: UserAvatarProps) {
    return (
        <div
            className={cn(
                'rounded-full bg-indigo-500/10 flex items-center justify-center overflow-hidden flex-shrink-0',
                sizeClasses[size],
                className
            )}
        >
            {user.profile_picture_url ? (
                <img
                    src={user.profile_picture_url}
                    alt={user.name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <UserIcon className={cn('text-indigo-400', iconSizes[size])} />
            )}
        </div>
    );
}
