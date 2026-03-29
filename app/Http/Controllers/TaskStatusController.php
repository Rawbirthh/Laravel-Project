<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskStatusFormRequest;
use App\Models\TaskStatus;
use Illuminate\Http\Request;
use App\Repositories\SearchPaginationRepository;
use Inertia\Inertia;

class TaskStatusController extends Controller
{
    protected $searchPaginationRepository;

    public function __construct(SearchPaginationRepository $searchPaginationRepository)
    {
        $this->searchPaginationRepository = $searchPaginationRepository;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', TaskStatus::class);

        $search = $request->get('search', '');
        $statuses = $this->searchPaginationRepository->searchAndPaginate(new TaskStatus(), $search, ['name']);

        return Inertia::render('TaskStatuses/Index', [
            'statuses' => $statuses,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(TaskStatusFormRequest $request)
    {
        $this->authorize('create', TaskStatus::class);

        TaskStatus::create($request->validated());

        return redirect()->route('admin.task-statuses.index')
            ->with('success', 'Task status created successfully.');
    }

    public function update(TaskStatusFormRequest $request, TaskStatus $taskStatus)
    {
        $this->authorize('update', $taskStatus);

        $taskStatus->update($request->validated());

        return redirect()->route('admin.task-statuses.index')
            ->with('success', 'Task status updated successfully.');
    }

    public function destroy(TaskStatus $taskStatus)
    {
        $this->authorize('delete', $taskStatus);

        $taskStatus->delete();

        return redirect()->route('admin.task-statuses.index')
            ->with('success', 'Task status deleted successfully.');
    }
}
