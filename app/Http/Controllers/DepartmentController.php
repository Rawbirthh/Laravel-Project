<?php

namespace App\Http\Controllers;

use App\Http\Requests\DepartmentRequest;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Repositories\SearchPaginationRepository;

class DepartmentController extends Controller
{
    protected $searchPaginationRepository;

    public function __construct(SearchPaginationRepository $searchPaginationRepository)
    {
        $this->searchPaginationRepository = $searchPaginationRepository;
    }

    public function index(Request $request)
    {
        $search = $request->get('search', '');
        $departments = $this->searchPaginationRepository->searchAndPaginate(new Department(), $search, ['code', 'name']);

        return Inertia::render('Departments/Index', [
            'departments' => $departments,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(DepartmentRequest $request)
    {
        $this->authorize('create', new Department());
        Department::create($request->validated());
        return redirect()->route('admin.departments.index')->with('success', 'Department created successfully!');
    }

    public function update(DepartmentRequest $request, Department $department)
    {
        $this->authorize('update', $department);
        $department->update($request->validated());
        return redirect()->route('admin.departments.index')->with('success', 'Department updated successfully!');
    }

    public function destroy(Department $department)
    {
        $this->authorize('delete', $department);
        $department->delete();
        return redirect()->route('admin.departments.index')->with('success', 'Department deleted successfully!');
    }
}
