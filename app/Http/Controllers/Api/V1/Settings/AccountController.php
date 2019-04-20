<?php

namespace App\Http\Controllers\Api\V1\Settings;

use Hash;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;

class AccountController extends Controller
{
    /**
     * Update User's password
     *
     * @param Illuminate\Http\Request $request
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function updatePassword(Request $request) : JsonResponse
    {
        $request->validate([
            'old_password'  => 'required|string',
            'password' => 'required|string|confirmed|min:8|pwned:100'
        ]);

        $user = auth()->guard('api')->user();

        if (! Hash::check($request->input('old_password'), $user->password)) {
            throw ValidationException::withMessages([
                'old_password' => [trans('auth.password_mismatch')]
            ]);

            return response()->json('Password was not Changed!', 422);
        }

        $user->password = bcrypt($request->input('password'));
        $user->update();

        return response()->json('Password Changed!');
    }
}
