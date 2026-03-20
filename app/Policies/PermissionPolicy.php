<?php

namespace App\Policies;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PermissionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('create.permissions');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('create.permissions');
    }

    public function update(User $user, Permission $permission): bool
    {
        return $user->hasPermission('update.permissions');
    }

    public function delete(User $user, Permission $permission): bool
    {
        return $user->hasPermission('delete.permissions');
    }
}
