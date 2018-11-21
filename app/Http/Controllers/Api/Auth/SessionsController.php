<?php

namespace App\Http\Controllers\Api\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class SessionsController extends Controller
{
    /**
     * Authenticate the user and then generate the access token.
     *
     * @param Illuminate\Http\Request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function signin(Request $request) : JsonResponse
    {
        if ($token = $this->attempt($request)) {
            return $this->respondWithToken($token);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    /**
     * Try to authenticate the user.
     *
     * @param Illuminate\Http\Request
     *
     * @return string/null
     */
    protected function attempt(Request $request) : ?string
    {
        $username = filter_var(
            $request->input('username'), FILTER_VALIDATE_EMAIL
        ) ? 'email' : 'username';

        return $this->guard()->attempt([
            $username => $request->input('username'),
            'password' => $request->input('password'),
        ]);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token) : JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $this->guard()->factory()->getTTL() * 60,
        ]);
    }

    /**
     * Get the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function user() : JsonResponse
    {
        return response()->json($this->guard()->user());
    }

    /**
     * Refresh the token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken($this->guard()->refresh());
    }

    /**
     * Sign the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function signout() : JsonResponse
    {
        $this->guard()->logout();

        return response()->json(['message' => 'Successfully signed out']);
    }

    /**
     * Get the guard to be used during authentication.
     *
     * @return \Illuminate\Contracts\Auth\Guard
     */
    public function guard() : Guard
    {
        return Auth::guard('api');
    }
}
