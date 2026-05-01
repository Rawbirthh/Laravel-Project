<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaskPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view.tasks');
    }

    public function view(User $user): bool
    {
        if ($user->hasPermission('view.all-employee.task')) {
            return true;
        }

        if ($user->hasPermission('view.my-own.task')) {
            return true;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('create.tasks');
    }

    public function update(User $user, Task $task): bool
    {
        if ($user->hasRole('manager') && $task->assigned_by === $user->id) {
            return true;
        }

        if ($user->hasRole('employee') && $task->assigned_to === $user->id) {
            return true;
        }

        return false;
    }

    public function delete(User $user, Task $task): bool
    {
        return $user->hasPermission('delete.tasks') && $task->assigned_by === $user->id;
    }

    public function updateStatus(User $user, Task $task): bool
    {
        return $task->assigned_to === $user->id;
    }

    public function submitTask(User $user, Task $task): bool
    {
        return $task->assigned_to === $user->id;
    }

    public function reviewTask(User $user, Task $task): bool
    {
        // return $user->hasPermission('review.tasks') || $task->assigned_by === $user->id;
        return $task->assigned_by === $user->id;
    }
}

