<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scheduled_manager_snapshots', function (Blueprint $table): void {
            $table->id();
            $table->string('owner')->unique();
            $table->string('active_semester')->default('3');
            $table->json('schedules')->nullable();
            $table->json('tasks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scheduled_manager_snapshots');
    }
};
