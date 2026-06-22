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

        Role::firstOrCreate(
            ['code' => 'usr'],
            [
                'slug' => 'user',
                'name' => 'User',
            ]
        );

        $admin = User::firstOrCreate(
            ['email' => env('ADMIN_EMAIL')],
            [
                'name' => env('ADMIN_NAME', 'Administrator'),
                'password' => bcrypt(env('ADMIN_PASSWORD')),
                'profile_picture' => null,
            ]
        );

        $admin->roles()->sync([$adminRole->id]);
    }
}