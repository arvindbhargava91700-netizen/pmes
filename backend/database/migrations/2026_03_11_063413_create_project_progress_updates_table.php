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
        Schema::create('project_progress_updates', function (Blueprint $table) {

            $table->id();

            $table->foreignId('project_id')
                ->constrained('projects')
                ->cascadeOnDelete();

            $table->foreignId('milestone_id')
                ->constrained('project_milestones');

            $table->integer('progress_percentage');

            $table->text('remarks')->nullable();

            $table->foreignId('updated_by')->constrained('users');

            $table->date('progress_date');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_progress_updates');
    }
};
