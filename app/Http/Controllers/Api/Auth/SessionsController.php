<?php

namespace App\Http\Controllers\Api\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;

class SessionsController extends Controller
{
    /**
     * Authenticate the user and then generate the auth token.
     *
     * @param Illuminate\Http\Request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function signin(Request $request) : JsonResponse
    {
        $request->validate([
            'username' => 'required|exists:users',
            'password' => 'required'
        ]);

        if ($token = $this->attempt($request)) {
            return $this->respondWithToken($token);
        }

        throw ValidationException::withMessages([
            'username' => [trans('auth.failed')]
        ]);

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    /**
     * Get the auth token.
     *
     * @param Illuminate\Http\Request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function token(Request $request) : JsonResponse
    {
        $authToken = DB::table('auth_tokens')->where([
            'user_id' => $request->input('uid')
        ])
            ->latest()
            ->first()
            ->token ?? null;

        return response()->json($authToken);
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
        $userId = JWTAuth::setToken($token)->toUser()->id;
        $authToken = [
            'token' => $token,
            'type' => 'bearer',
            'expires_in' => $this->guard()->factory()->getTTL() * 60,
        ];

        $this->storeAuthToken($authToken, $userId);

        return response()->json($userId);
    }

    /**
     * Store Auth Token.
     *
     * @param array $token
     * @param int $userId
     *
     * @return bool
     */
    protected function storeAuthToken(array $token, int $userId) : bool
    {
        DB::table('auth_tokens')->where('user_id', $userId)->delete();

        return DB::table('auth_tokens')->insert([
            'user_id' => $userId,
            'token' => $token['token'],
            'type' => $token['type'],
            'expires_in' => $token['expires_in'],
            'created_at' => now(),
            'updated_at' => now()
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
