<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;

class UserRepository
{
    public function getSameDepartmentUsersQuery(User $user, bool $excludeSelf = true): Builder
    {
        $departmentId = $user->departments()->first()?->id;
        
        if (!$departmentId) {
            return User::query()->whereRaw('1 = 0');
        }
        
        $query = User::with(['roles', 'departments'])
            ->whereHas('departments', function ($query) use ($departmentId) {
                $query->where('departments.id', $departmentId);
            });
        
        if ($excludeSelf) {
            $query->where('id', '!=', $user->id);
        }
        
        return $query;
    }

    public function getSameDepartmentUsers(User $user, bool $excludeSelf = true): Collection
    {
        return $this->getSameDepartmentUsersQuery($user, $excludeSelf)->latest()->get();
    }

    public function getDashboardStats(): array
    {
        return [
            // 'totalUsers' => User::count(),
            'employees' => $this->getSameDepartmentUsers(auth()->user())->count(),
            'totalTodos' => \App\Models\Todo::count(),
            'completedTodos' => \App\Models\Todo::where('completed', true)->count(),
        ];
    }
}