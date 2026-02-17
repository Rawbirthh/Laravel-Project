<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class TaskService
{
    protected UserRepository $userRepository;
    protected NotificationService $notificationService;

    public function __construct(UserRepository $userRepository, NotificationService $notificationService)
    {
        $this->userRepository = $userRepository;
        $this->notificationService = $notificationService;
    }

    public function createTask(array $data, User $manager): void
    {
        $departmentId = $manager->departments()->first()?->id;
        
        $groupId = count($data['assigned_to']) > 1 ? Str::random(10) : null;
        
        $baseData = [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'status' => 'pending',
            'priority' => $data['priority'] ?? 'medium',
            'due_date' => $data['due_date'] ?? null,
            'assigned_by' => $manager->id,
            'department_id' => $departmentId,
            'group_id' => $groupId,
        ];

        foreach ($data['assigned_to'] as $assigneeId) {
            $task = Task::create(array_merge($baseData, [
                'assigned_to' => $assigneeId,
            ]));

            $this->notificationService->notifyTaskAssigned($task);
        }
    }


    public function updateTask(Task $task, array $data): Task
    {
        $task->update($data);
        return $task->fresh();
    }

    public function updateTaskStatus(Task $task, string $status): Task
    {
        $task->update(['status' => $status]);
        return $task->fresh();
    }

    public function deleteTask(Task $task): void
    {
        $task->delete();
    }

    public function getTasksAssignedBy(User $manager, array $filters = []): LengthAwarePaginator
    {
        $query = Task::with(['assignee', 'department', 'otherGroupAssignees'])
            ->where('assigned_by', $manager->id)
            ->where(function ($q) {
                $q->whereNull('group_id')
                  ->orWhereIn('id', function($subQuery) {
                      $subQuery->selectRaw('MIN(id)')
                               ->from('tasks')
                               ->whereNotNull('group_id')
                               ->groupBy('group_id');
                  });
            });

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }
        if (!empty($filters['assigned_to'])) {
            $query->where('assigned_to', $filters['assigned_to']);
        }

        return $query->latest()->paginate(10);
    }

    public function getTasksAssignedTo(User $employee, array $filters = []): LengthAwarePaginator
    {
        $query = Task::with(['assigner', 'department', 'otherGroupAssignees.assignee'])
            ->where('assigned_to', $employee->id);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        return $query->latest()->paginate(10);
    }

    public function getAssignableEmployees(User $manager): Collection
    {
        return $this->userRepository->getSameDepartmentUsers($manager);
    }

    public function getManagerTaskStats(User $manager): array
    {
        $baseQuery = Task::where('assigned_by', $manager->id);

        return [
            'total' => $baseQuery->count(),
            'pending' => (clone $baseQuery)->where('status', 'pending')->count(),
            'in_progress' => (clone $baseQuery)->where('status', 'in_progress')->count(),
            'completed' => (clone $baseQuery)->where('status', 'completed')->count(),
            'high_priority' => (clone $baseQuery)->where('priority', 'high')->count(),
        ];
    }

    public function getEmployeeTaskStats(User $employee): array
    {
        $baseQuery = Task::where('assigned_to', $employee->id);

        return [
            'total' => $baseQuery->count(),
            'pending' => (clone $baseQuery)->where('status', 'pending')->count(),
            'in_progress' => (clone $baseQuery)->where('status', 'in_progress')->count(),
            'completed' => (clone $baseQuery)->where('status', 'completed')->count(),
        ];
    }
}
