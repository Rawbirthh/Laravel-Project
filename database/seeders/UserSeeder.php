<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $users = [];

        
        $batchSize = 1000;
        $total = 30000;

        for ($i = 0; $i < $total; $i++) {
            $users[] = [
                'name' => $faker->name(),
                'email' => $faker->unique()->safeEmail(),
                'profile_picture' => $faker->optional()->imageUrl(100, 100),
                'email_verified_at' => $faker->optional()->dateTime(),
                'password' => Hash::make('password123'),
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if (count($users) == $batchSize) {
                DB::table('users')->insert($users);
                $users = [];
                $this->command->info("Inserted ".($i+1)." / $total users...");
            }
        }

        if (!empty($users)) {
            DB::table('users')->insert($users);
        }

        $this->command->info("Inserted $total users successfully!");
    }
}