<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\UserManagementService;
use App\Repositories\SearchPaginationRepository;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UpdateUserRolesRequest;
use App\Http\Requests\UpdateUserDepartmentsRequest;
use App\Http\Requests\UpdateUserAllRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    protected $userManagementService;
    protected $searchPaginationRepository;

    public function __construct(UserManagementService $userManagementService, SearchPaginationRepository $searchPaginationRepository)
    {
        $this->userManagementService = $userManagementService;
        $this->searchPaginationRepository = $searchPaginationRepository;
    }

    public function index(Request $request)
    {
        $search = $request->get('search', '');
        $users = $this->searchPaginationRepository->searchAndPaginate(new User(), $search, ['name', 'email']);

        $users->getCollection()->transform(function ($user) {
            $user->load(['roles', 'departments']);
            return $user;
        });

        $allRoles = $this->userManagementService->getAllRoles();
        $allDepartments = $this->userManagementService->getAllDepartments();

        return Inertia::render('UserManagement/Index', [
            'users' => $users,
            'filters' => ['search' => $search],
            'allRoles' => $allRoles,
            'allDepartments' => $allDepartments,
        ]);
    }

    public function edit(User $user)
    {
        $this->authorize('update', $user);

        $user = $this->userManagementService->getUserWithRolesAndDepartments($user);
        $allRoles = $this->userManagementService->getAllRoles();
        $allDepartments = $this->userManagementService->getAllDepartments();

        return Inertia::render('UserManagement/Edit', [
            'user' => $user,
            'allRoles' => $allRoles,
            'allDepartments' => $allDepartments,
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $this->authorize('create', User::class);

        $this->userManagementService->createUser(
            $request->validated(),
            $request->hasFile('profile_picture') ? $request->file('profile_picture') : null
        );

        return redirect()->route('admin.user-management.index')
            ->with('success', 'User created successfully!');
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $this->authorize('update', $user);

        $this->userManagementService->updateUser(
            $user,
            $request->validated(),
            $request->hasFile('profile_picture') ? $request->file('profile_picture') : null
        );

        return redirect()->route('admin.user-management.index')
            ->with('success', 'User updated successfully!');
    }

    public function updateRoles(UpdateUserRolesRequest $request, User $user)
    {
        $this->authorize('update', $user);
        $this->userManagementService->syncUserRoles($user, $request->roles ?? []);

        return redirect()->route('admin.user-management.edit', $user)
            ->with('success', 'User roles updated successfully!');
    }

    public function updateDepartments(UpdateUserDepartmentsRequest $request, User $user)
    {
        $this->authorize('update', $user);
        $this->userManagementService->syncUserDepartments($user, $request->departments ?? []);

        return redirect()->route('admin.user-management.edit', $user)
            ->with('success', 'User departments updated successfully!');
    }

    public function updateAll(UpdateUserAllRequest $request, User $user)
    {
        $this->authorize('update', $user);
        $this->userManagementService->syncUserRolesAndDepartments(
            $user,
            $request->roles ?? [],
            $request->departments ?? []
        );

        return redirect()->route('admin.user-management.edit', $user)
            ->with('success', 'User roles and departments updated successfully!');
    }
}
