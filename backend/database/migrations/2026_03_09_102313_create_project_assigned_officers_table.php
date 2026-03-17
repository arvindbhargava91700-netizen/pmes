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
        Schema::create('project_assigned_officers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');

            $table->foreignId('je_id')->constrained('users');
            $table->foreignId('ae_id')->constrained('users');
            $table->foreignId('ee_id')->constrained('users');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_assigned_officers');
    }
};
