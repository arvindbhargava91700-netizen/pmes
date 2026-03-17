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
        Schema::create('eot_requests', function (Blueprint $table) {
            $table->id();
            $table->string('eot_number')->unique();
            $table->foreignId('project_id');
            $table->foreignId('contractor_id')->nullable();
            $table->integer('requested_days');
            $table->string('reason_type')->nullable();
            $table->boolean('ld_applicable')->default(false);
            $table->decimal('penalty_amount',12,2)->nullable();
            $table->foreignId('eot_status_id');
            $table->foreignId('current_approver_id')->nullable();
            $table->date('submitted_date');
            $table->text('remarks')->nullable();
            $table->foreignId('created_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eot_requests');
    }
};
