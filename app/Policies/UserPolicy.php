<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->isAdmin();
    }

    public function view(User $user)
    {
        return $user->isAdmin();
    }

    public function create(User $user)
    {
        return $user->hasPermission('create.users');
    }

    public function update(User $user)
    {
        return $user->hasPermission('update.users');
    }

    public function delete(User $user)
    {
        return $user->hasPermission('delete.users');
    }

    public function viewEmployee(User $user, User $targetUser)
    {
        if ($user->hasPermission('access.manager.dashboard')) {
            return true;
        }

        $userDeptId = $user->departments()->first()?->id;
        $targetDeptId = $targetUser->departments()->first()?->id;

        return $userDeptId && $userDeptId === $targetDeptId;
    }
}
