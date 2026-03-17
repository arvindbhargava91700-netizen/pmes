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
        Schema::create('tenders', function (Blueprint $table) {
            $table->id();
            $table->string('tender_code')->unique();
            $table->string('title');
            $table->string('department_id');
            $table->string('work_type_id');
            $table->decimal('estimated_cost', 15, 2);
            $table->decimal('emd_amount', 15, 2)->nullable();
            $table->text('description')->nullable();
            $table->string('tender_status_id');
            $table->string('created_by')->index();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['department_id', 'work_type_id', 'tender_status_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenders');
    }
};
