<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class ResetPasswordController extends Controller
{
    /**
     * Reset user password
     *
     * @param Illuminate\Http\Request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function reset(Request $request, string $token) : JsonResponse
    {
        $request->validate([
            'password' => 'required|min:8|confirmed|pwned:100'
        ]);

        $password_reset = DB::table('password_resets')
            ->where('token', $token)
            ->latest()
            ->first();

        if (! $password_reset) {
            return response()->json('Reset link invalid!', 422);
        }

        $user = User::where('email', $password_reset->email)->first();

        if (! $user) {
            return response()->json('User does not exist!', 422);
        }

        $user->password = bcrypt($request->input('password'));
        $user->update();

        return response()->json(
            _token_payload($this->guard()->login($user))
        );
    }

    /**
     * Get the guard to be used during authentication.
     *
     * @return \Illuminate\Contracts\Auth\Guard
     */
    protected function guard() : Guard
    {
        return Auth::guard('api');
    }
}
