<?php

namespace App\Http\Controllers;

use App\Models\ScheduledManagerSnapshot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScheduledManagerController extends Controller
{
    public function show(): JsonResponse
    {
        $snapshot = ScheduledManagerSnapshot::query()
            ->where('owner', 'octiyana-faiz-surya-permana')
            ->first();

        return response()->json([
            'data' => $snapshot,
        ]);
    }

    public function sync(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'activeSemester' => ['nullable', 'string', 'max:20'],
            'schedules' => ['nullable', 'array'],
            'tasks' => ['nullable', 'array'],
        ]);

        $snapshot = ScheduledManagerSnapshot::query()->updateOrCreate(
            ['owner' => 'octiyana-faiz-surya-permana'],
            [
                'active_semester' => $validated['activeSemester'] ?? '3',
                'schedules' => $validated['schedules'] ?? [],
                'tasks' => $validated['tasks'] ?? [],
            ],
        );

        return response()->json([
            'message' => 'Snapshot Scheduled Manager berhasil disimpan ke database.',
            'data' => $snapshot,
        ]);
    }
}
