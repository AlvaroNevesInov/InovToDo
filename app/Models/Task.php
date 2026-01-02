<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
