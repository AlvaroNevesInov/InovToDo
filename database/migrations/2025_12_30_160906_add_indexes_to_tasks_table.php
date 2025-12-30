<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Single column indexes for filtering
            $table->index('is_completed');
            $table->index('priority');
            $table->index('due_date');

            // Composite indexes for common query patterns
            $table->index(['user_id', 'is_completed']);
            $table->index(['user_id', 'due_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex(['tasks_is_completed_index']);
            $table->dropIndex(['tasks_priority_index']);
            $table->dropIndex(['tasks_due_date_index']);
            $table->dropIndex(['tasks_user_id_is_completed_index']);
            $table->dropIndex(['tasks_user_id_due_date_index']);
        });
    }
};
