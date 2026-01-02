<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Models\User;
use App\Policies\TaskPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected TaskPolicy $policy;
    protected User $user;
    protected User $otherUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->policy = new TaskPolicy();
        $this->user = User::factory()->create();
        $this->otherUser = User::factory()->create();
    }

    /** @test */
    public function any_user_can_view_any_tasks()
    {
        $this->assertTrue($this->policy->viewAny($this->user));
    }

    /** @test */
    public function user_can_view_their_own_task()
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $this->assertTrue($this->policy->view($this->user, $task));
    }

    /** @test */
    public function user_cannot_view_another_users_task()
    {
        $task = Task::factory()->create(['user_id' => $this->otherUser->id]);

        $this->assertFalse($this->policy->view($this->user, $task));
    }

    /** @test */
    public function any_user_can_create_tasks()
    {
        $this->assertTrue($this->policy->create($this->user));
    }

    /** @test */
    public function user_can_update_their_own_task()
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $this->assertTrue($this->policy->update($this->user, $task));
    }

    /** @test */
    public function user_cannot_update_another_users_task()
    {
        $task = Task::factory()->create(['user_id' => $this->otherUser->id]);

        $this->assertFalse($this->policy->update($this->user, $task));
    }

    /** @test */
    public function user_can_delete_their_own_task()
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $this->assertTrue($this->policy->delete($this->user, $task));
    }

    /** @test */
    public function user_cannot_delete_another_users_task()
    {
        $task = Task::factory()->create(['user_id' => $this->otherUser->id]);

        $this->assertFalse($this->policy->delete($this->user, $task));
    }

    /** @test */
    public function user_cannot_restore_tasks()
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $this->assertFalse($this->policy->restore($this->user, $task));
    }

    /** @test */
    public function user_cannot_force_delete_tasks()
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $this->assertFalse($this->policy->forceDelete($this->user, $task));
    }
}
