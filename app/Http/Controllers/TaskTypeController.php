<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskTypeFormRequest;
use App\Models\TaskType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskTypeController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', TaskType::class);

        $types = TaskType::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('TaskTypes/Index', [
            'types' => $types,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(TaskTypeFormRequest $request)
    {
        $this->authorize('create', TaskType::class);

        TaskType::create($request->validated());

        return redirect()->route('admin.task-types.index')
            ->with('success', 'Task type created successfully.');
    }

    public function update(TaskTypeFormRequest $request, TaskType $taskType)
    {
        $this->authorize('update', $taskType);

        $taskType->update($request->validated());

        return redirect()->route('admin.task-types.index')
            ->with('success', 'Task type updated successfully.');
    }

    public function destroy(TaskType $taskType)
    {
        $this->authorize('delete', $taskType);

        $taskType->delete();

        return redirect()->route('admin.task-types.index')
            ->with('success', 'Task type deleted successfully.');
    }
}
