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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('billing_id')
                ->constrained('billings')
                ->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->string('payment_slip')->nullable();
            $table->string('transaction_id')->nullable();
            $table->date('payment_date')->nullable();
            $table->foreignId('payment_status_id')
                ->constrained('payment_status_master')
                ->onDelete('restrict');
            $table->string('payment_bank_name')->nullable();
            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('approved_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
