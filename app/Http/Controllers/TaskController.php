<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

/**
 * Controller para gestão de tarefas (CRUD)
 *
 * Responsável por todas as operações relacionadas a tarefas:
 * - Listagem com filtros e paginação
 * - Criação de novas tarefas
 * - Visualização de tarefa individual
 * - Atualização de tarefas existentes
 * - Remoção de tarefas
 * - Toggle de status de conclusão
 *
 * Todas as operações são protegidas por autenticação e autorização via TaskPolicy.
 * Suporta respostas JSON (API) e HTML (views).
 */
class TaskController extends Controller
{
    /**
     * Lista todas as tarefas do utilizador autenticado
     *
     * Suporta filtros opcionais via query parameters:
     * - status: 'completed', 'pending', ou 'all'
     * - priority: 'high', 'medium', ou 'low'
     * - due_date: data específica no formato Y-m-d (ex: 2026-01-15)
     *
     * Retorna 15 tarefas por página, ordenadas por data de criação (mais recentes primeiro).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     *
     * @example GET /tasks?status=pending&priority=high&page=1
     * @example GET /tasks?due_date=2026-01-15
     */
    public function index(Request $request)
    {
        $query = $request->user()->tasks()
            ->orderBy('created_at', 'desc');

        // Filtro por status (completed/pending)
        if ($request->has('status')) {
            if ($request->status === 'completed') {
                $query->completed();
            } elseif ($request->status === 'pending') {
                $query->pending();
            }
        }

        // Filtro por prioridade
        if ($request->has('priority')) {
            $query->byPriority($request->priority);
        }

        // Filtro por data de vencimento
        if ($request->has('due_date')) {
            $query->byDueDate($request->due_date);
        }

        // Paginação: 15 itens por página
        $tasks = $query->paginate(15);

        if ($request->expectsJson()) {
            return response()->json($tasks);
        }

        return view('tasks.index', compact('tasks'));
    }

    /**
     * Cria uma nova tarefa
     *
     * A tarefa é automaticamente associada ao utilizador autenticado.
     * O campo 'is_completed' é iniciado como false por padrão.
     *
     * Validação:
     * - title: obrigatório, máximo 255 caracteres
     * - description: opcional
     * - due_date: opcional, deve ser uma data válida
     * - priority: obrigatório, deve ser 'high', 'medium' ou 'low'
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     *
     * @throws \Illuminate\Validation\ValidationException Se os dados forem inválidos
     *
     * @example POST /tasks
     * {
     *   "title": "Implementar testes",
     *   "description": "Criar testes unitários para o backend",
     *   "due_date": "2026-01-15",
     *   "priority": "high"
     * }
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'required|in:high,medium,low',
        ]);

        $task = $request->user()->tasks()->create($validated);

        if ($request->expectsJson()) {
            return response()->json($task, 201);
        }

        return redirect()->route('tasks.index')->with('success', 'Task created successfully!');
    }

    /**
     * Visualiza uma tarefa específica
     *
     * Requer que o utilizador seja o dono da tarefa (verificado via TaskPolicy).
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException Se utilizador não tiver permissão
     *
     * @example GET /tasks/123
     */
    public function show(Task $task)
    {
        $this->authorize('view', $task);

        if (request()->expectsJson()) {
            return response()->json($task);
        }

        return view('tasks.show', compact('task'));
    }

    /**
     * Atualiza uma tarefa existente
     *
     * Permite atualização parcial de campos. Apenas os campos fornecidos são atualizados.
     * Requer que o utilizador seja o dono da tarefa (verificado via TaskPolicy).
     *
     * Validação:
     * - title: opcional, mas se fornecido deve ter máximo 255 caracteres
     * - description: opcional
     * - due_date: opcional, deve ser uma data válida
     * - priority: opcional, mas se fornecido deve ser 'high', 'medium' ou 'low'
     * - is_completed: opcional, deve ser boolean
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException Se utilizador não tiver permissão
     * @throws \Illuminate\Validation\ValidationException Se os dados forem inválidos
     *
     * @example PUT /tasks/123
     * {
     *   "title": "Título atualizado",
     *   "is_completed": true
     * }
     */
    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

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

    /**
     * Remove uma tarefa
     *
     * A remoção é permanente e não pode ser desfeita.
     * Requer que o utilizador seja o dono da tarefa (verificado via TaskPolicy).
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException Se utilizador não tiver permissão
     *
     * @example DELETE /tasks/123
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        if (request()->expectsJson()) {
            return response()->json(['message' => 'Task deleted successfully!']);
        }

        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully!');
    }

    /**
     * Alterna o status de conclusão da tarefa
     *
     * Se a tarefa estiver completa, marca como pendente.
     * Se estiver pendente, marca como completa.
     *
     * Este é um atalho conveniente para atualizar apenas o campo is_completed.
     * Requer que o utilizador seja o dono da tarefa (verificado via TaskPolicy).
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException Se utilizador não tiver permissão
     *
     * @example PATCH /tasks/123/toggle
     */
    public function toggleComplete(Task $task)
    {
        $this->authorize('update', $task);

        $task->update(['is_completed' => !$task->is_completed]);

        if (request()->expectsJson()) {
            return response()->json($task);
        }

        return redirect()->route('tasks.index');
    }
}
