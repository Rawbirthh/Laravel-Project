<?php

namespace App\Policies;

use App\Models\TaskPriority;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPriorityPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view.task-priorities');
    }

    public function view(User $user, TaskPriority $taskPriority): bool
    {
        return $user->hasPermission('view.task-priorities');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('create.task-priorities');
    }

    public function update(User $user, TaskPriority $taskPriority): bool
    {
        return $user->hasPermission('update.task-priorities');
    }

    public function delete(User $user, TaskPriority $taskPriority): bool
    {
        return $user->hasPermission('delete.task-priorities');
    }
}
