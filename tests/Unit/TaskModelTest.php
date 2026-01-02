<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_belongs_to_a_user()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $task->user);
        $this->assertEquals($user->id, $task->user->id);
    }

    /** @test */
    public function it_has_fillable_attributes()
    {
        $task = new Task();
        $fillable = [
            'user_id',
            'title',
            'description',
            'due_date',
            'priority',
            'is_completed',
        ];

        $this->assertEquals($fillable, $task->getFillable());
    }

    /** @test */
    public function it_casts_due_date_to_date()
    {
        $task = Task::factory()->create([
            'due_date' => '2026-01-15',
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $task->due_date);
    }

    /** @test */
    public function it_casts_is_completed_to_boolean()
    {
        $task = Task::factory()->create(['is_completed' => 1]);

        $this->assertIsBool($task->is_completed);
        $this->assertTrue($task->is_completed);
    }

    /** @test */
    public function scope_completed_filters_completed_tasks()
    {
        Task::factory()->create(['is_completed' => true]);
        Task::factory()->create(['is_completed' => false]);

        $completedTasks = Task::completed()->get();

        $this->assertCount(1, $completedTasks);
        $this->assertTrue($completedTasks->first()->is_completed);
    }

    /** @test */
    public function scope_pending_filters_pending_tasks()
    {
        Task::factory()->create(['is_completed' => true]);
        Task::factory()->create(['is_completed' => false]);

        $pendingTasks = Task::pending()->get();

        $this->assertCount(1, $pendingTasks);
        $this->assertFalse($pendingTasks->first()->is_completed);
    }

    /** @test */
    public function scope_by_priority_filters_by_priority()
    {
        Task::factory()->create(['priority' => 'high']);
        Task::factory()->create(['priority' => 'medium']);
        Task::factory()->create(['priority' => 'low']);

        $highPriorityTasks = Task::byPriority('high')->get();

        $this->assertCount(1, $highPriorityTasks);
        $this->assertEquals('high', $highPriorityTasks->first()->priority);
    }

    /** @test */
    public function scope_by_due_date_filters_by_date()
    {
        $date = '2026-01-15';
        Task::factory()->create(['due_date' => $date]);
        Task::factory()->create(['due_date' => '2026-01-20']);

        $tasks = Task::byDueDate($date)->get();

        $this->assertCount(1, $tasks);
        $this->assertEquals($date, $tasks->first()->due_date->format('Y-m-d'));
    }

    /** @test */
    public function scope_overdue_filters_overdue_incomplete_tasks()
    {
        // Tarefa vencida e não completa
        Task::factory()->create([
            'due_date' => now()->subDays(5),
            'is_completed' => false,
        ]);

        // Tarefa vencida mas completa (não deve aparecer)
        Task::factory()->create([
            'due_date' => now()->subDays(3),
            'is_completed' => true,
        ]);

        // Tarefa futura (não deve aparecer)
        Task::factory()->create([
            'due_date' => now()->addDays(5),
            'is_completed' => false,
        ]);

        // Tarefa sem due_date (não deve aparecer)
        Task::factory()->create([
            'due_date' => null,
            'is_completed' => false,
        ]);

        $overdueTasks = Task::overdue()->get();

        $this->assertCount(1, $overdueTasks);
        $this->assertFalse($overdueTasks->first()->is_completed);
        $this->assertTrue($overdueTasks->first()->due_date->isPast());
    }

    /** @test */
    public function it_can_chain_scopes()
    {
        $user = User::factory()->create();

        Task::factory()->create([
            'user_id' => $user->id,
            'priority' => 'high',
            'is_completed' => false,
        ]);

        Task::factory()->create([
            'user_id' => $user->id,
            'priority' => 'high',
            'is_completed' => true,
        ]);

        $tasks = $user->tasks()
            ->pending()
            ->byPriority('high')
            ->get();

        $this->assertCount(1, $tasks);
        $this->assertFalse($tasks->first()->is_completed);
        $this->assertEquals('high', $tasks->first()->priority);
    }
}
