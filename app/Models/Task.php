<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'due_date',
        'priority',
        'is_completed',
    ];

    protected $casts = [
        'due_date' => 'date',
        'is_completed' => 'boolean',
    ];

    public function scopeCompleted($query)
    {
        return $query->where('is_completed', true);
    }

    public function scopePending($query)
    {
        return $query->where('is_completed', false);
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeByDueDate($query, $date)
    {
        return $query->whereDate('due_date', $date);
    }

    public function scopeOverdue($query)
    {
        return $query->where('is_completed', false)
                     ->whereNotNull('due_date')
                     ->whereDate('due_date', '<', now());
    }
}
