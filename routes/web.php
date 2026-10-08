<?php

use App\Http\Controllers\ScheduledManagerController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('app');
});

// API: baca dan simpan snapshot data (opsional, untuk cadangan ke database)
Route::get('/api/scheduled-manager', [ScheduledManagerController::class, 'show'])
    ->name('scheduled-manager.show');

Route::post('/api/scheduled-manager/sync', [ScheduledManagerController::class, 'sync']);

