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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('status_id')->constrained('task_statuses')->onDelete('cascade');
            $table->foreignId('priority_id')->constrained('task_priorities')->onDelete('cascade');
            $table->foreignId('type_id')->nullable()->constrained('task_types')->onDelete('set null');
            $table->date('due_date')->nullable();
            $table->foreignId('assigned_to')->constrained('users')->onDelete('cascade');
            $table->foreignId('assigned_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->string('group_id')->nullable();
            $table->timestamps();

            $table->index('assigned_to');
            $table->index('assigned_by');
            $table->index('status_id');
            $table->index('priority_id');
            $table->index('department_id');
            $table->index('group_id');
            $table->index('type_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
