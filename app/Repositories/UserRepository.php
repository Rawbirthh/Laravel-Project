<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Collection;

class UserRepository
{
    public function getSameDepartmentUsers(User $user, bool $excludeSelf = true): Collection
    {
        $departmentId = $user->departments()->first()?->id;
        
        if (!$departmentId) {
            return collect();
        }
        
        $query = User::with(['roles', 'departments'])
            ->whereHas('departments', function ($query) use ($departmentId) {
                $query->where('departments.id', $departmentId);
            });
        
        if ($excludeSelf) {
            $query->where('id', '!=', $user->id);
        }
        
        return $query->latest()->get();
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