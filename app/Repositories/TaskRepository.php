<?php

namespace App\Repositories;

use App\Models\Task;
use App\Models\TaskStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class TaskRepository
{
    const BOARD_PER_PAGE = 15;

    private function employeeBaseQuery(User $employee, array $filters = []): Builder
    {
        return Task::query()
            ->select(['id', 'title', 'status_id', 'priority_id', 'type_id', 'due_date', 'group_id', 'assigned_to', 'assigned_by', 'created_at'])
            ->with([
                'assigner:id,name',
                'taskStatus:id,name',
                'taskPriority:id,name',
                'taskType:id,name',
                'otherGroupAssignees.assignee:id,name',
                'submission' => fn($q) => $q->with(['reviewer:id,name', 'attachments:id,task_submission_id,file_path,file_name']),
            ])
            ->where('assigned_to', $employee->id)
            ->when($filters['search'] ?? null, fn($q, $v) => $q->where('title', 'like', "%{$v}%"))
            ->when($filters['priority_id'] ?? null, fn($q, $v) => $q->where('priority_id', $v))
            ->when($filters['type_id'] ?? null, fn($q, $v) => $q->where('type_id', $v))
            ->latest();
    }

    public function getPaginatedEmployeeTasks(User $employee, array $filters = []): LengthAwarePaginator
    {
        $query = $this->employeeBaseQuery($employee, $filters);

        if (!empty($filters['status_id'])) {
            $query->where('status_id', $filters['status_id']);
        }

        return $query->paginate(15);
    }

    public function getEmployeeBoardData(User $employee, array $filters = []): array
    {
        $perPage = self::BOARD_PER_PAGE;
        $statusNames = ['Pending', 'In Progress', 'For Review', 'Completed'];
        $columns = [];

        foreach ($statusNames as $name) {
            $status = TaskStatus::where('name', $name)->first(['id']);
            if (!$status) continue;

            $tasks = $this->employeeBaseQuery($employee, $filters)
                ->where('status_id', $status->id)
                ->paginate($perPage);

            $key = strtolower(str_replace(' ', '_', $name));
            $columns[$key] = [
                'tasks' => $tasks->items(),
                'total' => $tasks->total(),
                'current_page' => $tasks->currentPage(),
                'last_page' => $tasks->lastPage(),
                'per_page' => $tasks->perPage(),
            ];
        }

        return $columns;
    }

    public function getEmployeeColumnTasks(User $employee, string $statusName, int $page, array $filters = []): array
    {
        $perPage = self::BOARD_PER_PAGE;

        $status = TaskStatus::where('name', $statusName)->first(['id']);
        if (!$status) {
            return ['tasks' => [], 'total' => 0, 'current_page' => 1, 'last_page' => 1, 'per_page' => $perPage];
        }

        $tasks = $this->employeeBaseQuery($employee, $filters)
            ->where('status_id', $status->id)
            ->paginate($perPage, ['*'], 'page', $page);

        return [
            'tasks' => $tasks->items(),
            'total' => $tasks->total(),
            'current_page' => $tasks->currentPage(),
            'last_page' => $tasks->lastPage(),
            'per_page' => $tasks->perPage(),
        ];
    }

    public function getEmployeeTaskStats(User $employee): array
    {
        $base = Task::where('assigned_to', $employee->id);

        return [
            'total' => (clone $base)->count(),
            'pending' => (clone $base)->whereHas('taskStatus', fn($q) => $q->where('name', 'Pending'))->count(),
            'in_progress' => (clone $base)->whereHas('taskStatus', fn($q) => $q->where('name', 'In Progress'))->count(),
            'completed' => (clone $base)->whereHas('taskStatus', fn($q) => $q->where('name', 'Completed'))->count(),
        ];
    }
}
