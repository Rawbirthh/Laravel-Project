<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskStatusFormRequest;
use App\Models\TaskStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskStatusController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', TaskStatus::class);

        $statuses = TaskStatus::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

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
