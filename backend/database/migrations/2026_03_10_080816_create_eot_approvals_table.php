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

        Schema::create('eot_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eot_request_id')->constrained('eot_requests')->cascadeOnDelete();
            $table->foreignId('approver_id')->constrained('users')->cascadeOnDelete();
            $table->string('approver_role'); 
            // JE, AE, EE, CE etc
            $table->enum('status', ['pending','approved','rejected'])->default('pending');
            $table->integer('approval_level')->nullable(); 
            // 1 = JE, 2 = AE, 3 = EE, 4 = CE
            $table->text('remarks')->nullable();
            $table->timestamp('action_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eot_approvals');
    }
};
