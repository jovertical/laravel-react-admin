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
     * @var App\User
     */
    protected $user;

    /**
     * Create a new AccountController
     */
    public function __construct()
    {
        $this->user = auth()->guard('api')->user();
    }

    /**
     * Update User's login credentials
     *
     * @param Illuminate\Http\Request $request
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function updateCredentials(Request $request) : JsonResponse
    {
        $request->validate([
            'username' =>
                "required|string|unique:users,username,{$this->user->id},id,deleted_at,NULL",
            'email' =>
                "required|email|unique:users,email,{$this->user->id},id,deleted_at,NULL"
        ]);

        $this->user->username = $request->input('username');
        $this->user->email = $request->input('email');
        $this->user->update();

        return response()->json($this->user);
    }

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

        if (! Hash::check($request->input('old_password'), $this->user->password)) {
            throw ValidationException::withMessages([
                'old_password' => [trans('auth.password_mismatch')]
            ]);

            return response()->json('Password was not Changed!', 422);
        }

        $this->user->password = bcrypt($request->input('password'));
        $this->user->update();

        return response()->json('Password Changed!');
    }
}
