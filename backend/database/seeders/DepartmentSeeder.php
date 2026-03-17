<?php

namespace Database\Seeders;
use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $department=[
        ['name' => 'Roads & Highways', 'status' => 1],
            ['name' => 'Water & Sewerage', 'status' => 1],
            ['name' => 'Electrical', 'status' => 1],
            ['name' => 'Buildings', 'status' => 1],
            ['name' => 'Parks & Recreation', 'status' => 1],
            ['name' => 'IT & Smart City', 'status' => 1],
        ];
        Department::insert($department);
    }
}
