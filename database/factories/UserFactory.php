<?php

use Faker\Generator as Faker;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(App\User::class, function (Faker $faker) {
    $gender = $faker->randomElements(['female', 'male'])[0];

    return [
        'firstname' => ($firstName = (
            $gender === 'female' ? $faker->firstNameFemale : $faker->firstNameMale
        )),
        'middlename' => ($middleName = $faker->lastName),
        'lastname' => ($lastName = $faker->lastName),
        'gender' => $gender,
        'birthdate' => $faker->dateTimeThisCentury->format('Y-m-d'),
        'address' => $faker->address,

        'type' => $faker->randomElements(['superuser', 'user'])[0],
        'name' => "{$firstName} {$middleName} {$lastName}",
        'username' => $faker->userName,
        'email' => $faker->unique()->safeEmail,
        'password' => bcrypt('secret'),
        'remember_token' => Str::random(10),
    ];
});
