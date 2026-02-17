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
        return $user->hasRole('manager') || $user->hasRole('employee');
    }

    public function view(User $user, Task $task): bool
    {
        if ($user->hasRole('manager') && $task->assigned_by === $user->id) {
            return true;
        }

        if ($user->hasRole('employee') && $task->assigned_to === $user->id) {
            return true;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('manager');
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
        return $user->hasRole('manager') && $task->assigned_by === $user->id;
    }

    public function updateStatus(User $user, Task $task): bool
    {
        return $task->assigned_to === $user->id;
    }
}
