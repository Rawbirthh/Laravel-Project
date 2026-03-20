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
}
