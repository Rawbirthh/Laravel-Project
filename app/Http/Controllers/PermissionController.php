<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionFormRequest;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Repositories\SearchPaginationRepository;

class PermissionController extends Controller
{
    protected $searchPaginationRepository;

    public function __construct(SearchPaginationRepository $searchPaginationRepository)
    {
        $this->searchPaginationRepository = $searchPaginationRepository;
    }
    
    public function index(Request $request)
    {
        $this->authorize('viewAny', Permission::class);
        $search = $request->get('search', '');
        $permissions = $this->searchPaginationRepository->searchAndPaginate(new Permission(), $search, ['permission_name', 'display_name','description']);

        return Inertia::render('Permissions/Index', [
            'permissions' => $permissions,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(PermissionFormRequest $request)
    {
        $this->authorize('create', Permission::class);

        Permission::create($request->validated());

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission created successfully.');
    }

    public function update(PermissionFormRequest $request, Permission $permission)
    {
        $this->authorize('update', $permission);

        $permission->update($request->validated());

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission updated successfully.');
    }

    public function destroy(Permission $permission)
    {
        $this->authorize('delete', $permission);

        $permission->delete();

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission deleted successfully.');
    }
}
