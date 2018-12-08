<?php

namespace App\Http\Controllers\Api;

use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        return User::where('type', $request->input('type'))
            ->paginate($request->input('perPage') ?? 10);
    }

    public function store(Request $request)
    {
        return 'Store Users';
    }

    public function show(Request $request, User $user)
    {
        return $user;
    }

    public function update(Request $request, User $user)
    {
        return $user;
    }

    public function destroy(Request $request, User $user)
    {
        $user->delete();

        return User::where('type', $request->input('type'))
            ->paginate($request->input('perPage') ?? 10);
    }
}