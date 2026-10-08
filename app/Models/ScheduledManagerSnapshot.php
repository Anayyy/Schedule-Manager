<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduledManagerSnapshot extends Model
{
    protected $fillable = [
        'owner',
        'active_semester',
        'schedules',
        'tasks',
    ];

    protected function casts(): array
    {
        return [
            'schedules' => 'array',
            'tasks' => 'array',
        ];
    }
}
