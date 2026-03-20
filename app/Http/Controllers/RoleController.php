<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleRequest;
use App\Models\Role;
use App\Models\Permission;
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
        $this->authorize('view', new Role());
        $search = $request->get('search', '');
        $roles = $this->searchPaginationRepository->searchAndPaginate(new Role(), $search, ['code', 'name']);

        $roles->getCollection()->each(function ($role) {
            $role->load('permissions:id,permission_name,display_name');
        });

        $allPermissions = Permission::select('id', 'permission_name', 'display_name')
            ->orderBy('permission_name')
            ->get();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'allPermissions' => $allPermissions,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(RoleRequest $request)
    {
        $this->authorize('create', new Role());
        $role = Role::create($request->validated());
        
        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }
        
        return redirect()->route('admin.roles.index')->with('success', 'Role created successfully!');
    }

    public function update(RoleRequest $request, Role $role)
    {
        $this->authorize('update', $role);
        $role->update($request->validated());
        
        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        } else {
            $role->permissions()->sync([]);
        }
        
        return redirect()->route('admin.roles.index')->with('success', 'Role updated successfully!');
    }

    public function destroy(Role $role)
    {
        $this->authorize('delete', $role);
        $role->delete();
        return redirect()->route('admin.roles.index')->with('success', 'Role deleted successfully!');
    }
}
