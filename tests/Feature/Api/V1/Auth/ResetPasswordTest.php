<?php

namespace Tests\Feature\Api\V1\Auth;

use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Feature\Api\V1\BaseTest;

class ResetPasswordTest extends BaseTest
{
    /** @test */
    public function a_user_can_reset_their_password()
    {
        // The user that will reset their password.
        $user = User::first();

        // Create a dummy password reset data
        DB::table('password_resets')->insert([
            'email' => $user->email,
            'token' => Str::random(64),
            'created_at' => now()
        ]);

        $password_reset = DB::table('password_resets')
            ->where('email', $user->email)
            ->first();

        $password = 'tellmewhat';

        // The response body that should be sent alongside the request.
        $body = [
            'password' => $password,
            'password_confirmation' => $password
        ];

        // Assuming that their password has been reset,
        // It must return a 200 response status and then,
        // It must return a response body containing a valid JSON structure.
        $this->patch(route('api.v1.auth.password.reset', $password_reset->token), $body)
            ->assertStatus(200)
            ->assertJsonStructure([
                'auth_token', 'token_type', 'expires_in'
            ]);
    }
}
