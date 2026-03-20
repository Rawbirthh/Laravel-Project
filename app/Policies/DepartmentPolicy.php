<?php

namespace App\Policies;

use App\Models\Department;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DepartmentPolicy
{
    public function view(User $user, Department $department)
    {
        return $user->hasPermission('create.departments');
    }

    public function create(User $user)
    {
        return $user->hasPermission('create.departments');
    }

    public function update(User $user, Department $department)
    {
        return $user->hasPermission('update.departments');
    }

    public function delete(User $user, Department $department)
    {
        return $user->hasPermission('delete.departments');
    }
}
