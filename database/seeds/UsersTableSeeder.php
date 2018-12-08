<?php

use App\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = new User;
        $user->type = 'superuser';
        $user->username = 'jovert123';
        $user->email = 'jovert@helpersolutions.com';
        $user->password = bcrypt('secret');

        $user->firstname = 'Jovert';
        $user->middlename = 'Lota';
        $user->lastname = 'Palonpon';
        $user->gender = 'male';
        $user->birthdate = '1998-05-18';
        $user->address = 'Marungko, Angat, Bulacan';
        $user->save();

        $user = new User;
        $user->type = 'superuser';
        $user->username = 'ian123';
        $user->email = 'ian@helpersolutions.com';
        $user->password = bcrypt('secret');

        $user->firstname = 'Ian';
        $user->lastname = 'Lumbao';
        $user->save();
    }
}
