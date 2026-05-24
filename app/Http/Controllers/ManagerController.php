<?php

namespace App\Http\Controllers;

use App\Repositories\UserRepository;
use App\Services\TaskService;
use App\Services\EmployeeTaskService;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class ManagerController extends Controller
{
    protected UserRepository $userRepository;
    protected TaskService $taskService;
    protected EmployeeTaskService $employeeTaskService;

    public function __construct(
        UserRepository $userRepository, 
        TaskService $taskService,
        EmployeeTaskService $employeeTaskService
    ) {
        $this->userRepository = $userRepository;
        $this->taskService = $taskService;
        $this->employeeTaskService = $employeeTaskService;
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

    public function showEmployee(Request $request, User $user)
    {
        $this->authorize('viewEmployee', $user);

        $filters = [
            'status_id' => $request->get('status_id', ''),
            'priority_id' => $request->get('priority_id', ''),
            'type_id' => $request->get('type_id', ''),
            'task_type' => $request->get('task_type', ''),
            'search' => $request->get('search', ''),
        ];

        $taskStats = $this->employeeTaskService->getTaskStats($user);
        $tasks = $this->employeeTaskService->getTasks($user, $filters);
        $filterOptions = $this->employeeTaskService->getFilterOptions();

        return Inertia::render('Manager/Employees/Show', [
            'employee' => $user->load(['roles:id,name', 'departments:id,name']),
            'taskStats' => $taskStats,
            'tasks' => $tasks,
            'statuses' => $filterOptions['statuses'],
            'priorities' => $filterOptions['priorities'],
            'types' => $filterOptions['types'],
            'filters' => $filters,
        ]);
    }

    public function departmentTeam(Request $request)
    {
        $user = auth()->user();
        $search = $request->get('search', '');

        $employees = $this->userRepository->getSameDepartmentUsersQuery($user)
            ->select(['id', 'name', 'email', 'profile_picture'])
            ->with(['roles:id,name'])
            ->when($search, fn($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('name', 'like', "%{$v}%")
                  ->orWhere('email', 'like', "%{$v}%");
            }))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $bulkStats = $this->employeeTaskService->getBulkTaskStats(collect($employees->items()));

        $employees->getCollection()->transform(function ($emp) use ($bulkStats) {
            $emp->taskStats = $bulkStats[$emp->id] ?? [
                'total' => 0, 'pending' => 0, 'in_progress' => 0,
                'for_review' => 0, 'completed' => 0, 'high_priority' => 0,
            ];
            return $emp;
        });

        return Inertia::render('Manager/DepartmentTeam', [
            'employees' => $employees,
            'filters' => ['search' => $search],
        ]);
    }
}