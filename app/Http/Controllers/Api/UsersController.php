<?php

namespace App\Http\Controllers\Api;

use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        return $this->paginatedQuery($request);
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

        return $this->paginatedQuery($request);
    }

    public function restore(Request $request, $userId)
    {
        $user = User::withTrashed()->where('id', $userId)->first();
        $user->deleted_at = null;
        $user->update();

        return $this->paginatedQuery($request);
    }

    protected function paginatedQuery(Request $request)
    {
        $users = User::orderBy(
                $request->input('sortBy') ?? 'firstname',
                $request->input('sortType') ?? 'ASC'
            );

        if ($request->input('type')) {
            $users->where('type', $request->input('type'));
        }

        return $users->paginate($request->input('perPage') ?? 10);
    }
}