<?php

namespace App\Services;

use App\Models\Department;
use App\Models\Role;
use App\Models\Task;
use App\Models\TaskPriority;
use App\Models\TaskStatus;
use App\Models\TaskType;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AdminDashboardService
{
    public function getOverviewStats(): array
    {
        return Cache::remember('admin_overview_stats', 300, function () {
            $totalUsers = User::count();
            $totalTasks = Task::count();
            $totalDepartments = Department::count();
            $totalRoles = Role::count();

            $usersByRole = User::query()
                ->select('roles.slug', DB::raw('COUNT(*) as count'))
                ->join('user_roles', 'users.id', '=', 'user_roles.user_id')
                ->join('roles', 'user_roles.role_id', '=', 'roles.id')
                ->groupBy('roles.slug')
                ->pluck('count', 'slug')
                ->toArray();

            $tasksByStatus = TaskStatus::query()
                ->select('task_statuses.name', DB::raw('COUNT(tasks.id) as count'))
                ->leftJoin('tasks', 'task_statuses.id', '=', 'tasks.status_id')
                ->groupBy('task_statuses.id', 'task_statuses.name')
                ->pluck('count', 'name')
                ->toArray();

            $overdueTasks = DB::table('tasks')
                ->join('task_statuses', 'tasks.status_id', '=', 'task_statuses.id')
                ->where('tasks.due_date', '<', now()->startOfDay())
                ->where('task_statuses.name', '!=', 'Completed')
                ->count();

            return [
                'total_users'       => $totalUsers,
                'total_tasks'       => $totalTasks,
                'total_departments' => $totalDepartments,
                'total_roles'       => $totalRoles,
                'users_by_role'     => $usersByRole,
                'tasks_by_status'   => $tasksByStatus,
                'tasks_overdue'     => $overdueTasks,
            ];
        });
    }

    public function getTaskDistribution(): array
    {
        return Cache::remember('admin_task_distribution', 300, function () {
            $byStatus = TaskStatus::query()
                ->select('task_statuses.name', DB::raw('COUNT(tasks.id) as count'))
                ->leftJoin('tasks', 'task_statuses.id', '=', 'tasks.status_id')
                ->groupBy('task_statuses.id', 'task_statuses.name')
                ->orderBy('task_statuses.id')
                ->get()
                ->map(fn($s) => ['name' => $s->name, 'count' => (int) $s->count])
                ->values()
                ->toArray();

            $byPriority = TaskPriority::query()
                ->select('task_priorities.name', DB::raw('COUNT(tasks.id) as count'))
                ->leftJoin('tasks', 'task_priorities.id', '=', 'tasks.priority_id')
                ->groupBy('task_priorities.id', 'task_priorities.name')
                ->orderBy('task_priorities.id')
                ->get()
                ->map(fn($p) => ['name' => $p->name, 'count' => (int) $p->count])
                ->values()
                ->toArray();

            $byType = TaskType::query()
                ->select('task_types.name', DB::raw('COUNT(tasks.id) as count'))
                ->leftJoin('tasks', 'task_types.id', '=', 'tasks.type_id')
                ->groupBy('task_types.id', 'task_types.name')
                ->orderBy('task_types.id')
                ->get()
                ->map(fn($t) => ['name' => $t->name, 'count' => (int) $t->count])
                ->values()
                ->toArray();

            return [
                'by_status'   => $byStatus,
                'by_priority' => $byPriority,
                'by_type'     => $byType,
            ];
        });
    }

    public function getDepartmentBreakdown(): array
    {
        return Cache::remember('admin_department_breakdown', 300, function () {
            $taskCounts = Department::query()
                ->select('departments.id', 'departments.name', DB::raw('COUNT(tasks.id) as task_count'))
                ->leftJoin('tasks', 'departments.id', '=', 'tasks.department_id')
                ->groupBy('departments.id', 'departments.name')
                ->orderByDesc('task_count')
                ->get()
                ->map(fn($d) => [
                    'name'       => $d->name,
                    'task_count' => (int) $d->task_count,
                ])
                ->toArray();

            $userCounts = Department::query()
                ->select('departments.id', 'departments.name', DB::raw('COUNT(department_user.user_id) as user_count'))
                ->leftJoin('department_user', 'departments.id', '=', 'department_user.department_id')
                ->groupBy('departments.id', 'departments.name')
                ->orderByDesc('user_count')
                ->get()
                ->map(fn($d) => [
                    'name'       => $d->name,
                    'user_count' => (int) $d->user_count,
                ])
                ->toArray();

            $overdueByDept = DB::table('departments')
                ->select('departments.id', 'departments.name', DB::raw('SUM(CASE WHEN task_statuses.name IS NOT NULL AND task_statuses.name != "Completed" THEN 1 ELSE 0 END) as overdue_count'))
                ->leftJoin('tasks', function ($join) {
                    $join->on('departments.id', '=', 'tasks.department_id')
                        ->where('tasks.due_date', '<', now()->startOfDay());
                })
                ->leftJoin('task_statuses', 'tasks.status_id', '=', 'task_statuses.id')
                ->groupBy('departments.id', 'departments.name')
                ->orderByDesc('overdue_count')
                ->get()
                ->map(fn($d) => [
                    'name'          => $d->name,
                    'overdue_count' => (int) $d->overdue_count,
                ])
                ->toArray();

            return [
                'task_counts'     => $taskCounts,
                'user_counts'     => $userCounts,
                'overdue_by_dept' => $overdueByDept,
            ];
        });
    }

    public function getMonthlyTrends(): array
    {
        return Cache::remember('admin_monthly_trends', 300, function () {
            $sixMonthsAgo = now()->subMonths(6)->startOfMonth();

            $tasks = Task::query()
                ->select(DB::raw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count'))
                ->where('created_at', '>=', $sixMonthsAgo)
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get()
                ->keyBy(fn($r) => sprintf('%04d-%02d', $r->year, $r->month))
                ->map(fn($r) => (int) $r->count)
                ->toArray();

            $users = User::query()
                ->select(DB::raw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count'))
                ->where('created_at', '>=', $sixMonthsAgo)
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get()
                ->keyBy(fn($r) => sprintf('%04d-%02d', $r->year, $r->month))
                ->map(fn($r) => (int) $r->count)
                ->toArray();

            $months = collect();
            for ($i = 5; $i >= 0; $i--) {
                $months->push(now()->subMonths($i)->format('Y-m'));
            }

            return [
                'months' => $months->toArray(),
                'tasks'  => $months->map(fn($m) => (int) ($tasks[$m] ?? 0))->toArray(),
                'users'  => $months->map(fn($m) => (int) ($users[$m] ?? 0))->toArray(),
            ];
        });
    }

    public function getRecentActivity(): array
    {
        return Cache::remember('admin_recent_activity', 300, function () {
            $recentTasks = Task::query()
                ->select(['id', 'title', 'assigned_to', 'assigned_by', 'status_id', 'created_at'])
                ->with([
                    'assignee:id,name,profile_picture',
                    'assigner:id,name',
                    'taskStatus:id,name',
                ])
                ->latest()
                ->take(5)
                ->get()
                ->toArray();

            $newUsers = User::query()
                ->select(['id', 'name', 'email', 'profile_picture', 'created_at'])
                ->with('roles:id,name,slug')
                ->latest()
                ->take(5)
                ->get()
                ->toArray();

            return [
                'recent_tasks' => $recentTasks,
                'new_users'    => $newUsers,
            ];
        });
    }

    public function getOverdueTasks(): array
    {
        return Cache::remember('admin_overdue_tasks', 300, function () {
            return Task::query()
                ->select(['tasks.id', 'tasks.title', 'tasks.due_date', 'tasks.assigned_to', 'tasks.assigned_by', 'tasks.status_id', 'tasks.priority_id', 'tasks.department_id'])
                ->join('task_statuses', 'tasks.status_id', '=', 'task_statuses.id')
                ->with([
                    'assignee:id,name,email,profile_picture',
                    'assigner:id,name',
                    'taskStatus:id,name',
                    'taskPriority:id,name',
                    'department:id,name',
                ])
                ->where('tasks.due_date', '<', now()->startOfDay())
                ->where('task_statuses.name', '!=', 'Completed')
                ->latest('tasks.due_date')
                ->take(10)
                ->get()
                ->toArray();
        });
    }
}
