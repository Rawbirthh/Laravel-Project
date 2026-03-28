<?php

namespace App\Policies;

use App\Models\TaskType;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskTypePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view.task-types');
    }

    public function view(User $user, TaskType $taskType): bool
    {
        return $user->hasPermission('view.task-types');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('create.task-types');
    }

    public function update(User $user, TaskType $taskType): bool
    {
        return $user->hasPermission('update.task-types');
    }

    public function delete(User $user, TaskType $taskType): bool
    {
        return $user->hasPermission('delete.task-types');
    }
}
