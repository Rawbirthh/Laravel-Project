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
            'status_id' => $data['status_id'] ?? 1,
            'priority_id' => $data['priority_id'],
            'type_id' => $data['type_id'] ?? null,
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

    public function updateTaskStatus(Task $task, int $statusId): Task
    {
        $task->update(['status_id' => $statusId]);
        return $task->fresh();
    }

    public function deleteTask(Task $task): void
    {
        $task->delete();
    }

    public function getDepartmentTasks(User $manager, array $filters = []): LengthAwarePaginator
    {
        $departmentId = $manager->departments()->first()?->id;

        $query = Task::with(['assignee','assigner', 'department', 'otherGroupAssignees', 'taskStatus', 'taskPriority', 'taskType'])
            ->where('department_id', $departmentId)
            ->where(function ($q) {
                $q->whereNull('group_id')
                  ->orWhereIn('id', function($subQuery) {
                      $subQuery->selectRaw('MIN(id)')
                               ->from('tasks')
                               ->whereNotNull('group_id')
                               ->groupBy('group_id');
                  });
            });

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%")
                  ->orWhere('description', 'like', "%{$filters['search']}%");
            });
        }
        if (!empty($filters['status_id'])) {
            $query->where('status_id', $filters['status_id']);
        }
        if (!empty($filters['priority_id'])) {
            $query->where('priority_id', $filters['priority_id']);
        }
        if (!empty($filters['type_id'])) {
            $query->where('type_id', $filters['type_id']);
        }
        if (!empty($filters['assigned_to'])) {
            $query->where('assigned_to', $filters['assigned_to']);
        }

        return $query->latest()->paginate(10)->withQueryString();
    }

    public function getTasksAssignedBy(User $manager, array $filters = []): LengthAwarePaginator
    {
        $query = Task::with(['assignee','assigner', 'department', 'otherGroupAssignees', 'taskStatus', 'taskPriority', 'taskType'])
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

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%")
                  ->orWhere('description', 'like', "%{$filters['search']}%");
            });
        }
        if (!empty($filters['status_id'])) {
            $query->where('status_id', $filters['status_id']);
        }
        if (!empty($filters['priority_id'])) {
            $query->where('priority_id', $filters['priority_id']);
        }
        if (!empty($filters['type_id'])) {
            $query->where('type_id', $filters['type_id']);
        }
        if (!empty($filters['assigned_to'])) {
            $query->where('assigned_to', $filters['assigned_to']);
        }

        return $query->latest()->paginate(10)->withQueryString();
    }

    public function getTasksAssignedTo(User $employee, array $filters = []): LengthAwarePaginator
    {
        $query = Task::with(['assigner', 'department', 'otherGroupAssignees.assignee', 'taskStatus', 'taskPriority', 'taskType'])
            ->where('assigned_to', $employee->id);

        if (!empty($filters['status_id'])) {
            $query->where('status_id', $filters['status_id']);
        }

        if (!empty($filters['priority_id'])) {
            $query->where('priority_id', $filters['priority_id']);
        }

        if (!empty($filters['type_id'])) {
            $query->where('type_id', $filters['type_id']);
        }

        return $query->latest()->paginate(10);
    }

    public function getAssignableEmployees(User $manager): Collection
    {
        return $this->userRepository->getSameDepartmentUsers($manager);
    }

    public function getManagerTaskStats(User $manager): array
    {
        $departmentId = $manager->departments()->first()?->id;
        $tasks = Task::where('department_id', $departmentId)->with('taskStatus', 'taskPriority')->get();

        $statusCounts = $tasks->pluck('taskStatus.name')->countBy();
        $priorityCounts = $tasks->pluck('taskPriority.name')->countBy();

        return [
            'total' => $tasks->count(),
            'pending' => $statusCounts->get('Pending', 0),
            'in_progress' => $statusCounts->get('In Progress', 0),
            'completed' => $statusCounts->get('Completed', 0),
            'high_priority' => $priorityCounts->get('High', 0),
        ];
    }

    public function getEmployeeTaskStats(User $employee): array
    {
        $tasks = Task::where('assigned_to', $employee->id)->with('taskStatus')->get();

        $statusCounts = $tasks->pluck('taskStatus.name')->countBy();

        return [
            'total' => $tasks->count(),
            'pending' => $statusCounts->get('Pending', 0),
            'in_progress' => $statusCounts->get('In Progress', 0),
            'completed' => $statusCounts->get('Completed', 0),
        ];
    }
}
