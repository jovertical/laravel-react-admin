<?php

namespace Tests\Feature\Api\V1;

use App\User;
use Tests\Feature\Api\V1\BaseTest;

class AccountTest extends BaseTest
{
    /** @test */
    public function a_user_can_change_its_password()
    {
        $attributes = [
            'old_password' => 'secret',
            'password' => 'tellmewhat',
            'password_confirmation' => 'tellmewhat'
        ];

        // The response body that should be sent alongside the request.
        $body = array_merge($this->getDefaultPayload(), $attributes);

        // Assuming that the user's password has been updated,
        // It must return a 200 response status and then,
        // It must return a response body containing the text: `Password Changed!`
        $this->patch(route('api.v1.settings.account.password'), $body)
            ->assertStatus(200)
            ->assertSee('Password Changed!');
    }

    /** @test */
    public function a_user_can_update_its_login_credentials()
    {
        $attributes = [
            'username' => $this->faker->userName,
            'email' => $this->faker->email,
        ];

        // The response body that should be sent alongside the request.
        $body = array_merge($this->getDefaultPayload(), $attributes);

        // Assuming that the user's login credentials has been updated,
        // It must return a 200 response status and then,
        // It must return a response body containing the updated user's credentials.
        $this->patch(route('api.v1.settings.account.credentials'), $body)
            ->assertStatus(200)
            ->assertJsonFragment($attributes);
    }
}
