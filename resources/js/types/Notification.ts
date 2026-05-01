export interface Notification {
    id: number;
    user_id: number;
    type: 'task_assigned' | 'task_started' | 'task_completed' | 'task_status_changed' | 'task_submitted' | 'task_approved' | 'task_rejected';
    title: string;
    message: string | null;
    read: boolean;
    created_at: string;
    updated_at: string;
    notifiable?: {
        id: number;
        title: string;
    };
}
