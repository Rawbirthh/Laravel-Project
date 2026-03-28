<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $batchSize = 1000; // insert per batch
        $total = 100000;

        $data = [];

        for ($i = 1; $i <= $total; $i++) {
            $name = $faker->unique()->company();

            $data[] = [
                'code' => strtoupper(Str::random(6)),
                'name' => $name,
                'slug' => Str::slug($name),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Insert every 1000 rows
            if ($i % $batchSize === 0) {
                DB::table('departments')->insert($data);
                $data = [];
                echo "Inserted {$i} records\n";
            }
        }

        // Insert remaining
        if (!empty($data)) {
            DB::table('departments')->insert($data);
        }
    }
}
