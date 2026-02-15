<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(
            ['code' => 'adm'],
            [
                'slug' => 'admin',
                'name' => 'Admin',
            ]
        );

        $userRole = Role::firstOrCreate(
            ['code' => 'usr'],
            [
                'slug' => 'user',
                'name' => 'User',
            ]
        );

        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('robert123'),
                'profile_picture' => null,
            ]
        );

        $admin->roles()->sync([$adminRole->id]);
    }
}