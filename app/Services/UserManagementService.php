<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use App\Models\Department;

class UserManagementService
{
    public function syncUserRoles(User $user, array $roleIds): void
    {
        $user->roles()->sync($roleIds);
    }

    public function syncUserDepartments(User $user, array $departmentIds): void
    {
        $user->departments()->sync($departmentIds);
    }

    public function syncUserRolesAndDepartments(User $user, array $roleIds, array $departmentIds): void
    {
        $this->syncUserRoles($user, $roleIds);
        $this->syncUserDepartments($user, $departmentIds);
    }

    public function getAllRoles(): \Illuminate\Database\Eloquent\Collection
    {
        return Role::latest()->get();
    }

    public function getAllDepartments(): \Illuminate\Database\Eloquent\Collection
    {
        return Department::latest()->get();
    }

    public function getUserWithRolesAndDepartments(User $user): User
    {
        return $user->load(['roles', 'departments']);
    }
}
