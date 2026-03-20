<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RolePolicy
{
    public function view(User $user, Role $role): bool
    {
        return $user->hasPermission('create.roles');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('create.roles');
    }

    public function update(User $user, Role $role): bool
    {
        return $user->hasPermission('update.roles');
    }

    public function delete(User $user, Role $role): bool
    {
        return $user->hasPermission('delete.roles');
    }
}
