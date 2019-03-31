<?php

namespace Tests\Feature\Api\V1\Auth;

use App\User;
use Tests\Feature\Api\V1\BaseTest;

class SessionsTest extends BaseTest
{
    /** @test */
    public function a_user_can_be_identified()
    {
        $user = User::first();

        $payload = [
            'username' => $user->username,
        ];

        $this->post(route('api.v1.auth.identify'), $payload)
            ->assertStatus(200)
            ->assertSee($user->email);
    }

    /** @test */
    public function a_user_can_be_authenticated()
    {
        $user = User::first();

        $payload = [
            'username' => $user->username,
            'password' => 'secret'
        ];

        $this->post(route('api.v1.auth.signin'), $payload)
            ->assertStatus(200)
            ->assertJsonStructure([
                'auth_token', 'token_type', 'expires_in'
            ]);
    }

    /** @test */
    public function a_user_can_view_itself()
    {
        $payload = array_merge($this->getDefaultPayload(), []);

        $this->post(route('api.v1.auth.user'), $payload)
            ->assertStatus(200)
            ->assertJson(_test_user()->toArray());
    }

    /** @test */
    public function a_user_can_refresh_its_session()
    {
        $payload = array_merge($this->getDefaultPayload(), []);

        $this->post(route('api.v1.auth.refresh'), $payload)
            ->assertStatus(200)
            ->assertJsonStructure([
                'auth_token', 'token_type', 'expires_in'
            ])
            ->assertJsonMissing([
                'auth_token' => $payload['auth_token'],
            ]);
    }

    /** @test */
    public function a_user_can_signout()
    {
        $payload = array_merge($this->getDefaultPayload(), []);

        $this->post(route('api.v1.auth.signout'), $payload)
            ->assertStatus(200)
            ->assertJsonStructure([
                'message'
            ]);
    }
}
