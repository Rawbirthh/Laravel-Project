<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EmployeeTaskService
{
    public function getTaskStats(User $employee): array
    {
        $baseQuery = Task::where('assigned_to', $employee->id);

        return [
            'total' => (clone $baseQuery)->count(),
            'pending' => (clone $baseQuery)->whereHas('taskStatus', fn($q) => $q->where('name', 'Pending'))->count(),
            'in_progress' => (clone $baseQuery)->whereHas('taskStatus', fn($q) => $q->where('name', 'In Progress'))->count(),
            'completed' => (clone $baseQuery)->whereHas('taskStatus', fn($q) => $q->where('name', 'Completed'))->count(),
            'for_review' => (clone $baseQuery)->whereHas('taskStatus', fn($q) => $q->where('name', 'For Review'))->count(),
            'high_priority' => (clone $baseQuery)->whereHas('taskPriority', fn($q) => $q->where('name', 'High'))->count(),
        ];
    }

    public function getBulkTaskStats(Collection $users): array
    {
        $userIds = $users->pluck('id');

        $tasks = Task::whereIn('assigned_to', $userIds)
            ->with(['taskStatus:id,name', 'taskPriority:id,name'])
            ->get()
            ->groupBy('assigned_to');

        $stats = [];
        foreach ($users as $user) {
            $userTasks = $tasks->get($user->id, collect());
            $statusCounts = $userTasks->pluck('taskStatus.name')->countBy();
            $priorityCounts = $userTasks->pluck('taskPriority.name')->countBy();

            $stats[$user->id] = [
                'total' => $userTasks->count(),
                'pending' => $statusCounts->get('Pending', 0),
                'in_progress' => $statusCounts->get('In Progress', 0),
                'for_review' => $statusCounts->get('For Review', 0),
                'completed' => $statusCounts->get('Completed', 0),
                'high_priority' => $priorityCounts->get('High', 0),
            ];
        }

        return $stats;
    }

    public function getTasks(User $employee, array $filters): LengthAwarePaginator
    {
        $statusFilter = $filters['status_id'] ?? '';
        $priorityFilter = $filters['priority_id'] ?? '';
        $typeFilter = $filters['type_id'] ?? '';
        $taskTypeFilter = $filters['task_type'] ?? '';
        $search = $filters['search'] ?? '';

        return Task::query()
            ->select([
                'id', 'title', 'description', 'status_id', 'priority_id', 
                'type_id', 'due_date', 'group_id', 'assigned_to', 'assigned_by', 'created_at'
            ])
            ->with([
                'assignee:id,name,email',
                'assigner:id,name',
                'taskStatus:id,name',
                'taskPriority:id,name',
                'taskType:id,name'
            ])
            ->where('assigned_to', $employee->id)
            ->when($statusFilter, fn($query) => $query->where('status_id', $statusFilter))
            ->when($priorityFilter, fn($query) => $query->where('priority_id', $priorityFilter))
            ->when($typeFilter, fn($query) => $query->where('type_id', $typeFilter))
            ->when($search, fn($query) => $query->where('title', 'like', "%{$search}%"))
            ->when($taskTypeFilter === 'individual', fn($query) => $query->whereNull('group_id'))
            ->when($taskTypeFilter === 'group', fn($query) => $query->whereNotNull('group_id'))
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }

    public function getFilterOptions(): array
    {
        return [
            'statuses' => \App\Models\TaskStatus::select(['id', 'name'])->get(),
            'priorities' => \App\Models\TaskPriority::select(['id', 'name'])->get(),
            'types' => \App\Models\TaskType::select(['id', 'name'])->get(),
        ];
    }
}