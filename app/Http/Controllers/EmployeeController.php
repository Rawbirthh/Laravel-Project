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

    public function dashboard(Request $request)
    {
        $user = auth()->user();

        $dashboardData = $this->taskService->getEmployeeDashboardData(
            $user,
            $request->received_search,
            $request->assigned_search
        );

        return Inertia::render('Employee/Dashboard', [
            'taskStats' => $this->taskService->getEmployeeTaskStats($user),
            'assignedTaskStats' => $this->taskService->getEmployeeAssignedTasksStats($user),
            'recentTasks' => $dashboardData['recentTasks'],
            'assignedTasks' => $dashboardData['assignedTasks'],
        ]);
    }
}
