<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskPriorityFormRequest;
use App\Repositories\SearchPaginationRepository;
use App\Models\TaskPriority;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskPriorityController extends Controller
{
    protected $searchPaginationRepository;

    public function __construct(SearchPaginationRepository $searchPaginationRepository)
    {
        $this->searchPaginationRepository = $searchPaginationRepository;
    }
    
    public function index(Request $request)
    {
        $this->authorize('viewAny', TaskPriority::class);
        $search = $request->get('search', '');
        $priorities = $this->searchPaginationRepository->searchAndPaginate(new TaskPriority(), $search, ['name']);

        return Inertia::render('TaskPriorities/Index', [
            'priorities' => $priorities,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(TaskPriorityFormRequest $request)
    {
        $this->authorize('create', TaskPriority::class);

        TaskPriority::create($request->validated());

        return redirect()->route('admin.task-priorities.index')
            ->with('success', 'Task priority created successfully.');
    }

    public function update(TaskPriorityFormRequest $request, TaskPriority $taskPriority)
    {
        $this->authorize('update', $taskPriority);

        $taskPriority->update($request->validated());

        return redirect()->route('admin.task-priorities.index')
            ->with('success', 'Task priority updated successfully.');
    }

    public function destroy(TaskPriority $taskPriority)
    {
        $this->authorize('delete', $taskPriority);

        $taskPriority->delete();

        return redirect()->route('admin.task-priorities.index')
            ->with('success', 'Task priority deleted successfully.');
    }
}
