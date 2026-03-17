<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class AdminRoleSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // --------------------
        // PERMISSIONS
        // --------------------
        $permissions = [

            'dashboard.view',

            'user.view',
            'user.create',
            'user.edit',
            'user.delete',

            'role.view',
            'role.create',
            'role.edit',
            'role.delete',

            'project.view',
            'project.create',
            'project.edit',
            'project.delete',
            'project.approve',

            'report.view',
            'report.export',

            'settings.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'api',
            ]);
        }

        // --------------------
        // ROLES
        // --------------------
        $roles = [
            ['name' => 'Commissioner / Admin', 'description' => 'Full system access'],
            ['name' => 'Municipal Dept User', 'description' => 'Department operations'],
            ['name' => 'JE / AE / EE', 'description' => 'Site verification & monitoring'],
            ['name' => 'Contractor', 'description' => 'Project updates & billing'],
            ['name' => 'Public Use', 'description' => 'View projects & grievances'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(
                ['name' => $role['name'], 'guard_name' => 'api'],
                ['description' => $role['description']]
            );
        }


        // --------------------
        // ADMIN → ALL PERMISSIONS
        // --------------------
        $adminRole = Role::where('name', 'admin')->first();
        $adminRole->syncPermissions(Permission::all());

        $this->command->info('✅ Roles & admin permissions seeded successfully');
    }
}
