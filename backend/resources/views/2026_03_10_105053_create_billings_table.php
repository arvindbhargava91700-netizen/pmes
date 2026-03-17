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
        Schema::create('billings', function (Blueprint $table) {

            $table->id();

            $table->string('bill_number')->unique();

            $table->foreignId('project_id');

            $table->foreignId('milestone_id');

            $table->decimal('amount',12,2);

            $table->string('mb_number')->nullable(); 
            // Measurement Book number

            $table->date('bill_date');

            $table->foreignId('billing_status_id')
                ->constrained('billing_status_masters');

            $table->foreignId('created_by')
                ->constrained('users');

            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billings');
    }
};
