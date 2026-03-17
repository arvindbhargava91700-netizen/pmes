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
        Schema::create('grievances', function (Blueprint $table) {
            $table->id();
            $table->string('grievance_number')->unique();
            $table->string('title');
            $table->text('description');
            $table->integer('priority_id');
            $table->integer('status_id');
            $table->integer('ward_name')->nullable();
            $table->string('location')->nullable();
            $table->integer('assigned_to')->nullable();
            $table->string('complainant_name')->nullable();
            $table->string('complainant_mobile')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->timestamp('sla_due_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grievances');
    }
};
