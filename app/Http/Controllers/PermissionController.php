<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionFormRequest;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Permission::class);

        $permissions = Permission::query()
            ->when($request->search, function ($query, $search) {
                $query->where('permission_name', 'like', "%{$search}%")
                    ->orWhere('display_name', 'like', "%{$search}%");
            })
            ->orderBy('permission_name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Permissions/Index', [
            'permissions' => $permissions,
            'filters' => $request->only('search'),
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
