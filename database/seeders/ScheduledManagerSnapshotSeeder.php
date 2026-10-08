<?php

namespace Database\Seeders;

use App\Models\ScheduledManagerSnapshot;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ScheduledManagerSnapshotSeeder extends Seeder
{
    public function run(): void
    {
        $schedules = [
            [
                'id' => (string) Str::uuid(),
                'name' => 'Basis Data',
                'day' => 'Kamis',
                'start' => '08:00',
                'end' => '10:30',
                'room' => 'Lab Networking Data&Cloud',
                'className' => 'R.02',
                'lecturer' => 'Ariana Azimah',
                'sks' => 4,
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Data Science',
                'day' => 'Kamis',
                'start' => '10:40',
                'end' => '13:10',
                'room' => 'Lab Networking Data&Cloud',
                'className' => 'R.01',
                'lecturer' => 'Nur Hayati',
                'sks' => 4,
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Etika Profesi Teknologi Informasi',
                'day' => 'Kamis',
                'start' => '15:20',
                'end' => '17:00',
                'room' => 'C.004 VA',
                'className' => 'R.01',
                'lecturer' => 'Septi Andryana',
                'sks' => 2,
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Rekayasa Perangkat Lunak Informatika',
                'day' => 'Rabu',
                'start' => '10:40',
                'end' => '13:10',
                'room' => 'Lab. Data Science',
                'className' => 'R.01',
                'lecturer' => 'Lili Dwi Yulianto',
                'sks' => 3,
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Arsitektur dan Organisasi Komputer',
                'day' => 'Rabu',
                'start' => '13:20',
                'end' => '15:50',
                'room' => 'Lab Networking Data&Cloud',
                'className' => 'R.02',
                'lecturer' => 'Gatot Soepriyono',
                'sks' => 3,
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Perancangan dan Analisis Algoritma',
                'day' => 'Jumat',
                'start' => '09:50',
                'end' => '11:30',
                'room' => 'D.001 VA',
                'className' => 'R.01',
                'lecturer' => 'Aris Gunaryati',
                'sks' => 2,
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Struktur Data dan Algoritma',
                'day' => 'Jumat',
                'start' => '13:20',
                'end' => '15:50',
                'room' => 'Lab Networking Data&Cloud',
                'className' => 'R.03',
                'lecturer' => 'Frenda Farahdinna',
                'sks' => 3,
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Kecerdasan Artifisial',
                'day' => 'Jumat',
                'start' => '16:00',
                'end' => '18:30',
                'room' => 'D.402 VA',
                'className' => 'R.01',
                'lecturer' => 'Arie Gunawan',
                'sks' => 3,
            ],
        ];

        ScheduledManagerSnapshot::query()->updateOrCreate(
            ['owner' => 'octiyana-faiz-surya-permana'],
            [
                'active_semester' => '3',
                'schedules' => ['3' => $schedules],
                'tasks' => [],
            ]
        );
    }
}
