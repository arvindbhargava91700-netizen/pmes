<?php

namespace Database\Seeders;

use App\Models\WorkType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorkTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $workType = [
            ['workType' => 'Construction', 'status' => 1],
            ['workType' => 'Renovation', 'status' => 1],
            ['workType' => 'Maintenance', 'status' => 1],
            ['workType' => 'Supply & Installation', 'status' => 1],
            ['workType' => 'Consultancy', 'status' => 1],
        ];
        WorkType::insert($workType);
    }
}
