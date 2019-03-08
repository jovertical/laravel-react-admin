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
        $user->name = 'Jovert Palonpon';
        $user->username = 'jovert123';
        $user->email = 'jovert@example.com';
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
        $user->name = 'Ian Lumbao';
        $user->username = 'ian123';
        $user->email = 'ian@example.com';
        $user->password = bcrypt('secret');

        $user->firstname = 'Ian';
        $user->middlename = null;
        $user->lastname = 'Lumbao';
        $user->gender = 'male';
        $user->birthdate = null;
        $user->address = 'Tayuman, Manila, Metro Manila';
        $user->save();
    }
}
