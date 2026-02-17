<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\TaskService;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    protected TaskService $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function dashboard()
    {
        $user = auth()->user();

        return Inertia::render('Employee/Dashboard', [
            'taskStats' => $this->taskService->getEmployeeTaskStats($user),
            'recentTasks' => Task::with(['assigner', 'department', 'otherGroupAssignees.assignee'])
                ->where('assigned_to', $user->id)
                ->latest()
                ->take(10)
                ->get(),
        ]);
    }
}
