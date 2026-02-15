<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Repositories\SearchPaginationRepository;

class RoleController extends Controller
{
    protected $searchPaginationRepository;

    public function __construct(SearchPaginationRepository $searchPaginationRepository)
    {
        $this->searchPaginationRepository = $searchPaginationRepository;
    }

    public function index(Request $request)
    {
        $search = $request->get('search', '');
        $roles = $this->searchPaginationRepository->searchAndPaginate(new Role(), $search, ['code', 'name']);

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(RoleRequest $request)
    {
        $this->authorize('create', new Role());
        Role::create($request->validated());
        return redirect()->route('admin.roles.index')->with('success', 'Role created successfully!');
    }

    public function update(RoleRequest $request, Role $role)
    {
        $this->authorize('update', $role);
        $role->update($request->validated());
        return redirect()->route('admin.roles.index')->with('success', 'Role updated successfully!');
    }

    public function destroy(Role $role)
    {
        $this->authorize('delete', $role);
        $role->delete();
        return redirect()->route('admin.roles.index')->with('success', 'Role deleted successfully!');
    }
}
