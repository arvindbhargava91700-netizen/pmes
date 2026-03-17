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
        Schema::create('user_auth_methods', function (Blueprint $table) {
            $table->id();
            $table->string('user_id');

            $table->enum('type', ['password', 'otp', 'dsc']);

            // Password login
            $table->string('password')->nullable();

            // OTP login
            $table->string('otp_mobile', 15)->nullable();

            // DSC login
            $table->string('dsc_serial_no')->nullable();
            $table->string('dsc_issuer')->nullable();
            $table->timestamp('dsc_expiry')->nullable();

            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_auth_methods');
    }
};
