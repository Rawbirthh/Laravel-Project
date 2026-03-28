<?php

namespace App\Http\Controllers;

use App\Repositories\UserRepository;
use App\Services\TaskService;
use App\Models\Task;
use Illuminate\Http\Request;
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

    public function dashboard(Request $request)
    {
        $user = auth()->user();
        $teamSearch = $request->get('team_search', '');
        $taskSearch = $request->get('task_search', '');

        $users = $this->userRepository->getSameDepartmentUsersQuery($user)
            ->when($teamSearch, function ($query) use ($teamSearch) {
                $query->where(function ($q) use ($teamSearch) {
                    $q->where('name', 'like', "%{$teamSearch}%")
                      ->orWhere('email', 'like', "%{$teamSearch}%");
                });
            })
            ->latest()
            ->paginate(10, ['*'], 'team_page')
            ->withQueryString();

        $recentTasks = Task::query()
            ->with(['assignee', 'department', 'taskStatus'])
            ->where('assigned_by', $user->id)
            ->when($taskSearch, function ($query) use ($taskSearch) {
                $query->where('title', 'like', "%{$taskSearch}%");
            })
            ->latest()
            ->paginate(10, ['*'], 'task_page')
            ->withQueryString();

        return Inertia::render('Manager/Dashboard', [
            'stats' => $this->userRepository->getDashboardStats(),
            'taskStats' => $this->taskService->getManagerTaskStats($user),
            'users' => $users,
            'recentTasks' => $recentTasks,
            'filters' => [
                'team_search' => $teamSearch,
                'task_search' => $taskSearch,
            ],
        ]);
    }

    public function team()
    {
        $users = $this->userRepository->getSameDepartmentUsers(auth()->user());

        return Inertia::render('Manager/Team', ['users' => $users]);
    }
}