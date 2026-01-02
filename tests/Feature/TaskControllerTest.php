<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /** @test */
    public function user_can_view_their_tasks()
    {
        Task::factory()->count(3)->create(['user_id' => $this->user->id]);
        Task::factory()->count(2)->create(); // Tarefas de outro usuário

        $response = $this->actingAs($this->user)->getJson('/tasks');

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    /** @test */
    public function user_can_filter_tasks_by_status()
    {
        Task::factory()->create(['user_id' => $this->user->id, 'is_completed' => true]);
        Task::factory()->create(['user_id' => $this->user->id, 'is_completed' => false]);

        $response = $this->actingAs($this->user)
            ->getJson('/tasks?status=completed');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
    }

    /** @test */
    public function user_can_filter_tasks_by_priority()
    {
        Task::factory()->create(['user_id' => $this->user->id, 'priority' => 'high']);
        Task::factory()->create(['user_id' => $this->user->id, 'priority' => 'low']);

        $response = $this->actingAs($this->user)
            ->getJson('/tasks?priority=high');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
    }

    /** @test */
    public function user_can_create_a_task()
    {
        $taskData = [
            'title' => 'Nova Tarefa',
            'description' => 'Descrição da tarefa',
            'due_date' => '2026-01-15',
            'priority' => 'high',
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/tasks', $taskData);

        $response->assertStatus(201);
        $response->assertJsonFragment(['title' => 'Nova Tarefa']);

        $this->assertDatabaseHas('tasks', [
            'user_id' => $this->user->id,
            'title' => 'Nova Tarefa',
            'priority' => 'high',
        ]);
    }

    /** @test */
    public function creating_task_requires_title()
    {
        $taskData = [
            'description' => 'Descrição',
            'priority' => 'medium',
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/tasks', $taskData);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['title']);
    }

    /** @test */
    public function creating_task_requires_priority()
    {
        $taskData = [
            'title' => 'Tarefa',
            'description' => 'Descrição',
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/tasks', $taskData);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['priority']);
    }

    /** @test */
    public function priority_must_be_valid_value()
    {
        $taskData = [
            'title' => 'Tarefa',
            'priority' => 'invalid',
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/tasks', $taskData);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['priority']);
    }

    /** @test */
    public function user_can_view_their_own_task()
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/tasks/{$task->id}");

        $response->assertStatus(200);
        $response->assertJsonFragment(['id' => $task->id]);
    }

    /** @test */
    public function user_cannot_view_another_users_task()
    {
        $otherUser = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/tasks/{$task->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function user_can_update_their_own_task()
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $updateData = [
            'title' => 'Título Atualizado',
            'priority' => 'low',
        ];

        $response = $this->actingAs($this->user)
            ->putJson("/tasks/{$task->id}", $updateData);

        $response->assertStatus(200);
        $response->assertJsonFragment(['title' => 'Título Atualizado']);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Título Atualizado',
            'priority' => 'low',
        ]);
    }

    /** @test */
    public function user_cannot_update_another_users_task()
    {
        $otherUser = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)
            ->putJson("/tasks/{$task->id}", ['title' => 'Hack']);

        $response->assertStatus(403);
    }

    /** @test */
    public function user_can_delete_their_own_task()
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/tasks/{$task->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    /** @test */
    public function user_cannot_delete_another_users_task()
    {
        $otherUser = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/tasks/{$task->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('tasks', ['id' => $task->id]);
    }

    /** @test */
    public function user_can_toggle_task_completion()
    {
        $task = Task::factory()->create([
            'user_id' => $this->user->id,
            'is_completed' => false,
        ]);

        $response = $this->actingAs($this->user)
            ->patchJson("/tasks/{$task->id}/toggle");

        $response->assertStatus(200);
        $response->assertJsonFragment(['is_completed' => true]);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'is_completed' => true,
        ]);
    }

    /** @test */
    public function toggle_switches_task_completion_state()
    {
        $task = Task::factory()->create([
            'user_id' => $this->user->id,
            'is_completed' => true,
        ]);

        $response = $this->actingAs($this->user)
            ->patchJson("/tasks/{$task->id}/toggle");

        $response->assertStatus(200);
        $response->assertJsonFragment(['is_completed' => false]);
    }

    /** @test */
    public function user_cannot_toggle_another_users_task()
    {
        $otherUser = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)
            ->patchJson("/tasks/{$task->id}/toggle");

        $response->assertStatus(403);
    }

    /** @test */
    public function guest_cannot_access_tasks()
    {
        $response = $this->getJson('/tasks');

        $response->assertStatus(401);
    }
}
