<?php

namespace Tests\Feature\Api\V1\Auth;

use App\User;
use App\Jobs\ProcessPasswordResetRequest;
use Illuminate\Support\Facades\Bus;
use Tests\Feature\Api\V1\BaseTest;

class ForgotPasswordTest extends BaseTest
{
    /** @test */
    public function a_user_can_request_for_password_reset_link()
    {
        // The user that is requesting for the Password Reset Link.
        $user = User::first();

        // The response body that should be sent alongside the request.
        $body = [
            'email' => $user->email
        ];

        // Assuming that the Password Reset Request is processed,
        // It must return a 200 response status and then,
        // It must return a response body containing: `Sending...`.
        $this->post(route('api.v1.auth.password.request'), $body)
            ->assertStatus(200)
            ->assertSee('Sending...');

        // TODO: Assert if Jobs are dispatched & Notifications are sent.
    }
}
