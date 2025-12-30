<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::query()->orderBy('created_at', 'desc');

        if ($request->has('status')) {
            if ($request->status === 'completed') {
                $query->completed();
            } elseif ($request->status === 'pending') {
                $query->pending();
            }
        }

        if ($request->has('priority')) {
            $query->byPriority($request->priority);
        }

        if ($request->has('due_date')) {
            $query->byDueDate($request->due_date);
        }

        $tasks = $query->get();

        if ($request->expectsJson()) {
            return response()->json($tasks);
        }

        return view('tasks.index', compact('tasks'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'required|in:high,medium,low',
        ]);

        $task = Task::create($validated);

        if ($request->expectsJson()) {
            return response()->json($task, 201);
        }

        return redirect()->route('tasks.index')->with('success', 'Task created successfully!');
    }

    public function show(Task $task)
    {
        if (request()->expectsJson()) {
            return response()->json($task);
        }

        return view('tasks.show', compact('task'));
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'sometimes|required|in:high,medium,low',
            'is_completed' => 'sometimes|boolean',
        ]);

        $task->update($validated);

        if ($request->expectsJson()) {
            return response()->json($task);
        }

        return redirect()->route('tasks.index')->with('success', 'Task updated successfully!');
    }

    public function destroy(Task $task)
    {
        $task->delete();

        if (request()->expectsJson()) {
            return response()->json(['message' => 'Task deleted successfully!']);
        }

        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully!');
    }

    public function toggleComplete(Task $task)
    {
        $task->update(['is_completed' => !$task->is_completed]);

        if (request()->expectsJson()) {
            return response()->json($task);
        }

        return redirect()->route('tasks.index');
    }
}
