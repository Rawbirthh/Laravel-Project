<?php

namespace App\Providers;

use App\Models\Department;
use App\Models\Role;
use App\Models\Task;
use App\Models\TaskPriority;
use App\Models\TaskStatus;
use App\Models\TaskType;
use App\Models\User;
use App\Models\Todo;
use App\Observers\AdminDashboardCacheObserver;
use App\Policies\TodoPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Gate::policy(Todo::class, TodoPolicy::class);

        Task::observe(AdminDashboardCacheObserver::class);
        User::observe(AdminDashboardCacheObserver::class);
        Department::observe(AdminDashboardCacheObserver::class);
        Role::observe(AdminDashboardCacheObserver::class);
        TaskPriority::observe(AdminDashboardCacheObserver::class);
        TaskStatus::observe(AdminDashboardCacheObserver::class);
        TaskType::observe(AdminDashboardCacheObserver::class);
    }
}
