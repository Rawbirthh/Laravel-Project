<?php

namespace App\Policies;

use App\Models\TaskStatus;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskStatusPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view.task-statuses');
    }

    public function view(User $user, TaskStatus $taskStatus): bool
    {
        return $user->hasPermission('view.task-statuses');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('create.task-statuses');
    }

    public function update(User $user, TaskStatus $taskStatus): bool
    {
        return $user->hasPermission('update.task-statuses');
    }

    public function delete(User $user, TaskStatus $taskStatus): bool
    {
        return $user->hasPermission('delete.task-statuses');
    }
}
