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
        Schema::create('project_progress_photos', function (Blueprint $table) {

            $table->id();

            $table->foreignId('project_id')
                ->constrained('projects')
                ->cascadeOnDelete();

            $table->foreignId('milestone_id')
                ->nullable()
                ->constrained('project_milestones');

            $table->string('photo_path');

            $table->text('caption')->nullable();

            $table->foreignId('uploaded_by')
                ->constrained('users');

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_progress_photos');
    }
};
