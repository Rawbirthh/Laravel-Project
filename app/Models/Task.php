<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use PHPUnit\Metadata\Group;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status_id',
        'priority_id',
        'type_id',
        'due_date',
        'group_id',
        'assigned_to',
        'assigned_by',
        'department_id',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function otherGroupAssignees()
    {
        return $this->hasMany(Task::class, 'group_id', 'group_id')
            ->where('id', '!=', $this->id)
            ->with('assignee');
    }

    public function assigner()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function taskStatus()
    {
        return $this->belongsTo(TaskStatus::class, 'status_id');
    }

    public function taskPriority()
    {
        return $this->belongsTo(TaskPriority::class, 'priority_id');
    }

    public function taskType()
    {
        return $this->belongsTo(TaskType::class, 'type_id');
    }

    public function scopePending($query)
    {
        return $query->whereHas('taskStatus', function ($q) {
            $q->where('name', 'pending');
        });
    }

    public function scopeInProgress($query)
    {
        return $query->whereHas('taskStatus', function ($q) {
            $q->where('name', 'in_progress');
        });
    }

    public function scopeCompleted($query)
    {
        return $query->whereHas('taskStatus', function ($q) {
            $q->where('name', 'completed');
        });
    }

    public function scopeHighPriority($query)
    {
        return $query->whereHas('taskPriority', function ($q) {
            $q->where('name', 'high');
        });
    }

    public function scopeAssignedTo($query, $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    public function scopeAssignedBy($query, $userId)
    {
        return $query->where('assigned_by', $userId);
    }
}
