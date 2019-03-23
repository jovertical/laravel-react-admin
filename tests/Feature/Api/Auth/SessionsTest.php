<?php

namespace Tests\Feature\Api\Auth;

use App\User;
use Tests\Feature\Api\BaseTest;

class SessionsTest extends BaseTest
{
    /** @test */
    public function a_user_can_be_identified()
    {
        $user = User::first();

        $attributes = [
            'username' => $user->username,
        ];

        $this->post(route('api.auth.identify'), $attributes)
            ->assertStatus(200)
            ->assertSee($user->email);
    }

    /** @test */
    public function a_user_can_be_authenticated()
    {
        $user = User::first();

        $attributes = [
            'username' => $user->username,
            'password' => 'secret'
        ];

        $this->post(route('api.auth.signin'), $attributes)
            ->assertStatus(200)
            ->assertJsonStructure([
                'auth_token', 'token_type', 'expires_in'
            ]);
    }
}