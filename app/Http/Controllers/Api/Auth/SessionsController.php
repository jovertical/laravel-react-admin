<?php

namespace App\Http\Controllers\Api\Auth;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class SessionsController extends Controller
{
    /**
     * Identify if the given username exists.
     *
     * @param Illuminate\Http\Request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function identify(Request $request) : JsonResponse
    {
        $request->validate([
            'username' => "required|exists:users,{$this->identifier($request)},deleted_at,NULL",
        ]);

        return response()->json(
            User::where(
                $this->identifier($request), $request->input('username')
            )->first()->email
        );
    }

    /**
     * Authenticate the user and then give it's userId.
     *
     * @param Illuminate\Http\Request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function signin(Request $request) : JsonResponse
    {
        $request->validate([
            'username' => "required|exists:users,{$this->identifier($request)}",
            'password' => 'required'
        ]);

        if ($token = $this->attempt($request)) {
            return $this->respondWithUserId($token);
        }

        throw ValidationException::withMessages([
            'password' => [trans('auth.failed')]
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
        return response()->json(
            optional(User::find($request->input('uid')))->auth_token
        );
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
        return $this->guard()->attempt([
            $this->identifier($request) => $request->input('username'),
            'password' => $request->input('password'),
        ]);
    }

    /**
     * Get the identifier for the user.
     *
     * @param Illuminate\Http\Request
     *
     * @return string
     */
    protected function identifier(Request $request) : string
    {
        return filter_var(
            $request->input('username'), FILTER_VALIDATE_EMAIL
        ) ? 'email' : 'username';
    }

    /**
     * Get the authenticated user's Id.
     *
     * @param  string $token
     *
     * @return Illuminate\Http\JsonResponse
     */
    protected function respondWithUserId($token) : JsonResponse
    {
        $user = JWTAuth::setToken($token)->toUser();

        $this->saveAuthToken($token, $user);

        return response()->json($user->id);
    }

    /**
     * Save Auth Token.
     *
     * @param string $token
     * @param App\User $user
     *
     * @return bool
     */
    protected function saveAuthToken(string $token, User $user) : bool
    {
        $user->auth_token = $token;
        $user->last_signin = now();

        return $user->update();
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
        return $this->respondWithUserId($this->guard()->refresh());
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
