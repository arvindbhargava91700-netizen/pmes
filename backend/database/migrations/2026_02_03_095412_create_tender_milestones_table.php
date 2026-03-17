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
        Schema::create('tender_milestones', function (Blueprint $table) {
            $table->id();
            $table->string('tender_id')->index();
            $table->integer('sequence_no');
            $table->string('title');
            $table->integer('duration_weeks');
            $table->boolean('is_critical')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tender_milestones');
    }
};
