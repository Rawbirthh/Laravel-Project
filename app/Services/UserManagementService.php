<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use App\Models\Department;
use Illuminate\Support\Facades\Storage;

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

    public function createUser(array $data, $profilePicture = null): User
    {
        $profilePicturePath = null;
        if ($profilePicture) {
            $profilePicturePath = $profilePicture->store('profile-pictures', 'public');
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'profile_picture' => $profilePicturePath,
        ]);

        $this->syncUserRolesAndDepartments(
            $user,
            $data['roles'] ?? [],
            $data['departments'] ?? []
        );

        return $user;
    }

    public function updateUser(User $user, array $data, $profilePicture = null): User
    {
        $userData = [
            'name' => $data['name'],
            'email' => $data['email'],
        ];

        if (!empty($data['password'])) {
            $userData['password'] = $data['password'];
        }

        if ($profilePicture) {
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }
            $userData['profile_picture'] = $profilePicture->store('profile-pictures', 'public');
        }

        $user->update($userData);

        $this->syncUserRolesAndDepartments(
            $user,
            $data['roles'] ?? [],
            $data['departments'] ?? []
        );

        return $user;
    }
}
