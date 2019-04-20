<?php

namespace Tests\Feature\Api\V1;

use App\User;
use Tests\Feature\Api\V1\BaseTest;

class ProfileTest extends BaseTest
{
    /** @test */
    public function a_user_can_update_its_profile()
    {
        $gender = $this->faker->randomElements(['female', 'male'])[0];

        $attributes = [
            'firstname' => ($firstName = (
                $gender === 'female'
                    ? $this->faker->firstNameFemale
                    : $this->faker->firstNameMale
            )),
            'lastname' => ($lastName = $this->faker->lastName),

            'gender' =>  $gender,
            'birthdate' => $this->faker->dateTimeThisCentury->format('Y-m-d'),
            'address' => $this->faker->address,
        ];

        // The response body that should be sent alongside the request.
        $body = array_merge($this->getDefaultPayload(), $attributes);

        // Assuming that the user's profile has been updated,
        // It must return a 200 response status and then,
        // It must return a response containing the updated attributes.
        $this->patch(route('api.v1.settings.profile'), $body)
            ->assertStatus(200)
            ->assertJsonFragment($attributes);
    }
}
