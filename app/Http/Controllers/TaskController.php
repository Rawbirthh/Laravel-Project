<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Services\TaskService;
use App\Services\NotificationService;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
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
        $user = auth()->user();
        $filters = $request->only(['status', 'priority', 'assigned_to']);

        if ($user->hasRole('manager')) {
            $tasks = $this->taskService->getTasksAssignedBy($user, $filters);
            $employees = $this->taskService->getAssignableEmployees($user);
            $stats = $this->taskService->getManagerTaskStats($user);

            return Inertia::render('Manager/Tasks/Index', [
                'tasks' => $tasks,
                'employees' => $employees,
                'stats' => $stats,
                'filters' => $filters,
            ]);
        }

        $tasks = $this->taskService->getTasksAssignedTo($user, $filters);
        $stats = $this->taskService->getEmployeeTaskStats($user);

        return Inertia::render('Employee/Tasks/Index', [
            'tasks' => $tasks,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Task::class);

        $employees = $this->taskService->getAssignableEmployees(auth()->user());

        return Inertia::render('Manager/Tasks/Create', [
            'employees' => $employees,
        ]);
    }

    public function store(StoreTaskRequest $request)
    {
        $this->authorize('create', Task::class);

        $this->taskService->createTask($request->validated(), auth()->user());

        return redirect()->route('manager.tasks.index')
            ->with('success', 'Task(s) assigned successfully!');
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);

        $task->load(['assignee', 'assigner', 'department']);

        return Inertia::render('Tasks/Show', [
            'task' => $task,
        ]);
    }

    public function edit(Task $task)
    {
        $this->authorize('update', $task);

        $task->load(['assignee']);
        $employees = $this->taskService->getAssignableEmployees(auth()->user());

        return Inertia::render('Manager/Tasks/Edit', [
            'task' => $task,
            'employees' => $employees,
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorize('update', $task);

        $this->taskService->updateTask($task, $request->validated());

        return redirect()->route('manager.tasks.index')
            ->with('success', 'Task updated successfully!');
    }

    public function updateStatus(UpdateTaskStatusRequest $request, Task $task)
    {
        $this->authorize('updateStatus', $task);

        $oldStatus = $task->status;
        $this->taskService->updateTaskStatus($task, $request->status);

        $this->notificationService->notifyTaskStatusChanged($task, $oldStatus, $request->status);

        return redirect()->back()
            ->with('success', 'Task status updated!');
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $this->taskService->deleteTask($task);

        return redirect()->route('manager.tasks.index')
            ->with('success', 'Task deleted successfully!');
    }
}
