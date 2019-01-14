<?php

namespace App\Http\Controllers\Api\Auth;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Jobs\SendPasswordResetLink;
use App\Http\Controllers\Controller;

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

        dispatch(new SendPasswordResetLink($user));

        return response()->json('Sending...');
    }
}