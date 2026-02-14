<?php

namespace App\Http\Controllers;

use App\Http\Requests\TodoRequest;
use App\Models\Todo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TodoController extends Controller
{
    public function index()
    {
        return Inertia::render('Todos/Index', [
            'todos' => auth()->user()->todos()->latest()->get(),
        ]);
    }

    public function store(TodoRequest $request)
    {
        $this->authorize('create', new Todo());
        auth()->user()->todos()->create($request->validated());
        return redirect()->route('todos.index')->with('success', 'Todo created successfully!');
    }

    public function update(TodoRequest $request, Todo $todo)
    {
        $this->authorize('update', $todo);
        $todo->update($request->validated());
        return redirect()->route('todos.index')->with('success', 'Todo updated successfully!');
    }

    public function destroy(Todo $todo)
    {
        $this->authorize('delete', $todo);
        $todo->delete();
        return redirect()->route('todos.index')->with('success', 'Todo deleted successfully!');
    }
}
