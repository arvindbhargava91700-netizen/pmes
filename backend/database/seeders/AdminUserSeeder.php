<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        $admin = User::firstOrCreate(
            [
                'username' => 'admin',  
            ],
            [
                'name'   => 'System Admin',
                'email'  => 'admin@gmail.com',
                'mobile' => '9999999999',
                'status' => true,
            ]
        );

        // Create Password Auth Method
        $admin->authMethods()->firstOrCreate(
            ['type' => 'password'],
            [
                'password' => Hash::make('Cmp@123#com'),
                'is_active' => true,
            ]
        );

        // Assign Admin Role
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        $this->command->info('✅ Admin user created & admin role assigned');
    }
}
