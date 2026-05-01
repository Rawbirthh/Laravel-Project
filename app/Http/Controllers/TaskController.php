<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use App\Models\TaskStatus;
use App\Models\TaskPriority;
use App\Models\TaskType;
use App\Services\TaskService;
use App\Services\NotificationService;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use App\Http\Requests\SubmitTaskRequest;
use App\Http\Requests\ReviewTaskRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    protected TaskService $taskService;
    protected NotificationService $notificationService;

    public function __construct(TaskService $taskService, NotificationService $notificationService)
    {
        $this->taskService = $taskService;
        $this->notificationService = $notificationService;
    }

    public function index(Request $request)
    {
        $this->authorize('view', Task::class);
        $user = auth()->user();
        $filters = $request->only(['status_id', 'priority_id', 'type_id', 'assigned_to', 'search']);

        $statuses = TaskStatus::orderBy('name')->get(['id', 'name']);
        $priorities = TaskPriority::orderBy('name')->get(['id', 'name']);
        $types = TaskType::orderBy('name')->get(['id', 'name']);

        if ($user->hasPermission('view.all-employee.task')) {
            $tasks = $this->taskService->getDepartmentTasks($user, $filters);
            $employees = $this->taskService->getAssignableEmployees($user);
            $stats = $this->taskService->getManagerTaskStats($user);

            return Inertia::render('Manager/Tasks/Index', [
                'tasks' => $tasks,
                'employees' => $employees,
                'stats' => $stats,
                'filters' => $filters,
                'statuses' => $statuses,
                'priorities' => $priorities,
                'types' => $types,
            ]);
        }

        $tasks = $this->taskService->getTasksAssignedTo($user, $filters);
        $stats = $this->taskService->getEmployeeTaskStats($user);

        return Inertia::render('Employee/Tasks/Index', [
            'tasks' => $tasks,
            'stats' => $stats,
            'filters' => $filters,
            'statuses' => $statuses,
            'priorities' => $priorities,
            'types' => $types,
        ]);
    }

    public function create(Request $request)
    {
        $this->authorize('create', Task::class);

        $user = auth()->user();
        $employees = $this->taskService->getAssignableEmployees($user);
        $priorities = TaskPriority::orderBy('name')->get(['id', 'name']);
        $types = TaskType::orderBy('name')->get(['id', 'name']);

        // Get assigned tasks with filters
        $filters = $request->only(['search']);
        $assignedTasks = $this->taskService->getTasksAssignedBy($user, $filters);

        return Inertia::render('Manager/Tasks/Create', [
            'employees' => $employees,
            'priorities' => $priorities,
            'types' => $types,
            'assignedTasks' => $assignedTasks,
            'filters' => $filters,
        ]);
    }

    public function store(StoreTaskRequest $request)
    {
        $this->authorize('create', Task::class);

        $this->taskService->createTask($request->validated(), auth()->user());

        return redirect()->route('tasks.index')
            ->with('success', 'Task(s) assigned successfully!');
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);

        $task->load(['assignee', 'assigner', 'department', 'taskStatus', 'taskPriority', 'taskType']);

        return Inertia::render('Tasks/Show', [
            'task' => $task,
        ]);
    }

    public function edit(Task $task)
    {
        $this->authorize('update', $task);

        $task->load(['assignee']);
        $employees = $this->taskService->getAssignableEmployees(auth()->user());
        $statuses = TaskStatus::orderBy('name')->get(['id', 'name']);
        $priorities = TaskPriority::orderBy('name')->get(['id', 'name']);
        $types = TaskType::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Manager/Tasks/Edit', [
            'task' => $task,
            'employees' => $employees,
            'statuses' => $statuses,
            'priorities' => $priorities,
            'types' => $types,
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);

        $this->taskService->updateTask($task, $request->validated());

        return redirect()->route('tasks.index')
            ->with('success', 'Task updated successfully!');
    }

    public function updateStatus(UpdateTaskStatusRequest $request, Task $task)
    {
        $this->authorize('updateStatus', $task);

        $oldStatus = $task->taskStatus->name;
        $updatedTask = $this->taskService->updateTaskStatus($task, $request->status_id);
        $newStatus = $updatedTask->taskStatus->name;
        
        $this->notificationService->notifyTaskStatusChanged($updatedTask, $oldStatus, $newStatus);

        return redirect()->back()
            ->with('success', 'Task status updated!');
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $this->taskService->deleteTask($task);

        return redirect()->route('tasks.index')
            ->with('success', 'Task deleted successfully!');
    }

    public function submitTask(SubmitTaskRequest $request, Task $task)
    {
        $this->authorize('submitTask', $task);

        $updatedTask = $this->taskService->submitTask($task, $request->validated('solution_text'), $request->file('attachments') ?? []);
        
        $this->notificationService->notifyTaskSubmitted($updatedTask);

        return redirect()->back()
            ->with('success', 'Task submitted for review!');
    }

    public function reviewTask(ReviewTaskRequest $request, Task $task)
    {
        $this->authorize('reviewTask', $task);

        $data = $request->validated();
        $updatedTask = $this->taskService->reviewTask($task, $data, auth()->user());
        
        $this->notificationService->notifyTaskReviewed($updatedTask, $data['action'], $data['comment'] ?? null);

        return redirect()->back()
            ->with('success', 'Task review completed!');
    }
}
