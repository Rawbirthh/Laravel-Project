import { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import type { Notification } from '@/types/Notification';

interface NotificationBellProps {
    initialCount?: number;
}

export default function NotificationBell({ initialCount = 0 }: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(route('notifications.unread'));
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const markAsRead = async (notificationId: number) => {
        try {
            await axios.put(route('notifications.read', notificationId));
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(route('notifications.read-all'));
            setUnreadCount(0);
            setNotifications([]);
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        const notificationId = notification.id;
        const notificationType = notification.type;
        
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        try {
            await axios.put(route('notifications.read', notificationId));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
        
        setIsOpen(false);
        
        if (notificationType === 'task_assigned' || 
            notificationType === 'task_status_changed' || 
            notificationType === 'task_started' || 
            notificationType === 'task_completed' ||
            notificationType === 'task_submitted' ||
            notificationType === 'task_approved' ||
            notificationType === 'task_rejected') {
            window.location.href = route('tasks.index');
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'task_assigned':
                return '📋';
            case 'task_started':
                return '🚀';
            case 'task_completed':
                return '✅';
            case 'task_status_changed':
                return '🔄';
            case 'task_submitted':
                return '📤';
            case 'task_approved':
                return '🎉';
            case 'task_rejected':
                return '❌';
            default:
                return '📌';
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
                <Bell className="w-5 h-5 text-slate-400 hover:text-white" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-[#0f0f10] border border-slate-800 rounded-lg shadow-xl z-50">
                        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white">Notifications</h3>
                            {notifications.length > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-indigo-400 hover:text-indigo-300"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-slate-500">
                                    Loading...
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-4 text-center text-slate-500">
                                    No new notifications
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-800">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="p-3 hover:bg-slate-900/50 transition-colors cursor-pointer"
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="flex items-start gap-2">
                                                <span className="text-lg">
                                                    {getNotificationIcon(notification.type)}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-200">
                                                        {notification.title}
                                                    </p>
                                                    {notification.message && (
                                                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-slate-600 mt-1">
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <span className="w-2 h-2 bg-indigo-500 rounded-full shrink-0" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-2 border-t border-slate-800">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.get(route('notifications.index'));
                                    }}
                                    className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 py-1"
                                >
                                    View all notifications
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
