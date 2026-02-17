<?php

namespace App\Http\Controllers;

use App\Repositories\UserRepository;
use App\Services\TaskService;
use App\Models\Task;
use Inertia\Inertia;

class ManagerController extends Controller
{
    protected UserRepository $userRepository;
    protected TaskService $taskService;

    public function __construct(UserRepository $userRepository, TaskService $taskService)
    {
        $this->userRepository = $userRepository;
        $this->taskService = $taskService;
    }

    public function dashboard()
    {
        $user = auth()->user();

        return Inertia::render('Manager/Dashboard', [
            'stats' => $this->userRepository->getDashboardStats(),
            'taskStats' => $this->taskService->getManagerTaskStats($user),
            'users' => $this->userRepository->getSameDepartmentUsers($user),
            'recentTasks' => Task::with(['assignee', 'department'])
                ->where('assigned_by', $user->id)
                ->latest()
                ->take(10)
                ->get(),
        ]);
    }

    public function team()
    {
        $users = $this->userRepository->getSameDepartmentUsers(auth()->user());

        return Inertia::render('Manager/Team', ['users' => $users]);
    }
}