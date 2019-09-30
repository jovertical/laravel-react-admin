<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Jobs\ProcessPasswordResetRequest;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    /**
     * Send a password reset link email
     *
     * @param Illuminate\Http\Request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendResetLinkEmail(Request $request) : JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users'
        ]);

        $user = User::where('email', $request->input('email'))->first();
        $token = Str::random(64);

        if ($this->storeResetToken($user, $token)) {
            $routeSuffix = strstr(
                $request->input('routeSuffix'),
                ':',
                true
            ).$token.'?email='.$user->email;

            $resetLink = route('backoffice.welcome').'#'.$routeSuffix;

            dispatch(new ProcessPasswordResetRequest($user, $resetLink));
        }

        return response()->json('Sending...');
    }

    /**
     * Store the reset token.
     *
     * @param App\User
     * @param string
     *
     * @return bool
     */
    public function storeResetToken(User $user, string $token) : bool
    {
        return DB::table('password_resets')->insert([
            'email' => $user->email,
            'token' => $token,
            'created_at' => now()
        ]);
    }
}
