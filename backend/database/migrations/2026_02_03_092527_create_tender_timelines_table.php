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
        Schema::create('tender_timelines', function (Blueprint $table) {
            $table->id();
            $table->string('tender_id')->unique()->index();
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('schedule_type', ['daily', 'weekly', 'monthly']);
            $table->integer('project_duration_weeks');
            $table->boolean('is_locked')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tender_timelines');
    }
};
