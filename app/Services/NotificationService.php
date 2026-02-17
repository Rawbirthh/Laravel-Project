<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Task;
use App\Models\User;

class NotificationService
{

    public function notifyTaskAssigned(Task $task): void
    {
        $assignee = $task->assignee;
        $assigner = $task->assigner;

        if (!$assignee || !$assigner) {
            return;
        }

        Notification::create([
            'user_id' => $assignee->id,
            'type' => 'task_assigned',
            'title' => 'New Task Assigned',
            'message' => "You have been assigned a new task: \"{$task->title}\" by {$assigner->name}",
            'notifiable_type' => Task::class,
            'notifiable_id' => $task->id,
            'read' => false,
        ]);
    }

    public function notifyTaskStatusChanged(Task $task, string $oldStatus, string $newStatus): void
    {
        $assignee = $task->assignee;
        $assigner = $task->assigner;

        if (!$assignee || !$assigner) {
            return;
        }

        //notify the manager when employee starts or completes a task
        if ($assignee->id !== $assigner->id) {
            $statusText = str_replace('_', ' ', $newStatus);
            
            Notification::create([
                'user_id' => $assigner->id,
                'type' => 'task_status_changed',
                'title' => 'Task Status Updated',
                'message' => "Task \"{$task->title}\" has been marked as {$statusText} by {$assignee->name}",
                'notifiable_type' => Task::class,
                'notifiable_id' => $task->id,
                'read' => false,
            ]);
        }
    }

    public function getUnreadNotifications(User $user, int $limit = 10)
    {
        return $user->notifications()
            ->unread()
            ->take($limit)
            ->get();
    }

    public function getNotifications(User $user, int $perPage = 15)
    {
        return $user->notifications()
            ->paginate($perPage);
    }

    public function markAsRead(int $notificationId, User $user): bool
    {
        $notification = Notification::where('user_id', $user->id)
            ->where('id', $notificationId)
            ->first();

        if ($notification) {
            $notification->markAsRead();
            return true;
        }

        return false;
    }

    public function markAllAsRead(User $user): void
    {
        Notification::where('user_id', $user->id)
            ->unread()
            ->update(['read' => true]);
    }

    public function getUnreadCount(User $user): int
    {
        return $user->notifications()->unread()->count();
    }
}
