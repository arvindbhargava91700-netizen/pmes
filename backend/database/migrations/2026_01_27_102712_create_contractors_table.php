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
        Schema::create('contractors', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('contractor_name');
            $table->string('number', 15);
            $table->string('email')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('added_by')->nullable();
            $table->tinyInteger('status')->default(1)->comment('1=active,0=inactive');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contractors');
    }
};
