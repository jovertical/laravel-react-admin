<?php

namespace App\Http\Controllers\Api;

use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\{JsonResponse, Request};
use Illuminate\Pagination\LengthAwarePaginator;

class UsersController extends Controller
{
    /**
     * List all resource.
     *
     * @param Illuminate\Http\Request $request
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function index(Request $request) : JsonResponse
    {
        return response()->json($this->paginatedQuery($request));
    }

    /**
     * Store a new resource.
     *
     * @param Illuminate\Http\Request $request
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function store(Request $request) : JsonResponse
    {
        $request->validate([
            'type' => 'required|in:superuser,user',
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users'
        ]);

        $user = new User;
        $user->type = $request->input('type');
        $user->firstname = ($firstname = $request->input('firstname'));
        $user->lastname = ($lastname = $request->input('lastname'));

        $user->name = "{$firstname} {$lastname}";
        $user->email = $request->input('email');
        $user->save();

        return response()->json($user, 201);
    }

    /**
     * Show a resource.
     *
     * @param Illuminate\Http\Request $request
     * @param App\User $user
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function show(Request $request, User $user) : JsonResponse
    {
        return response()->json($user);
    }

    /**
     * Update a resource.
     *
     * @param Illuminate\Http\Request $request
     * @param App\User $user
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function update(Request $request, User $user) : JsonResponse
    {
        return response()->json($user);
    }

    /**
     * Destroy a resource.
     *
     * @param Illuminate\Http\Request $request
     * @param App\User $user
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, User $user) : JsonResponse
    {
        $user->delete();

        return response()->json($this->paginatedQuery($request));
    }

    /**
     * Destroy multiple resources.
     *
     * @param Illuminate\Http\Request $request
     * @param string $idCollectionString
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function destroyMultiple(Request $request, string $idCollectionString)
    {
        $idCollection = explode(',', $idCollectionString);

        foreach ($idCollection as $id) {
            User::where('id', $id)->delete();
        }

        return response()->json($this->paginatedQuery($request));
    }

    /**
     * Restore a resource.
     *
     * @param Illuminate\Http\Request $request
     * @param string $userId
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function restore(Request $request, $userId)
    {
        $user = User::withTrashed()->where('id', $userId)->first();
        $user->deleted_at = null;
        $user->update();

        return response()->json($this->paginatedQuery($request));
    }

    /**
     * Restore multiple resources.
     *
     * @param Illuminate\Http\Request $request
     * @param string $idCollectionString
     *
     * @return Illuminate\Http\JsonResponse
     */
    public function restoreMultiple(Request $request, string $idCollectionString)
    {
        $idCollection = explode(',', $idCollectionString);

        foreach ($idCollection as $id) {
            User::withTrashed()->where('id', $id)->update([
                'deleted_at' => null
            ]);
        }

        return response()->json($this->paginatedQuery($request));
    }

    /**
     * Get the paginated resource query.
     *
     * @param Illuminate\Http\Request
     *
     * @return Illuminate\Pagination\LengthAwarePaginator
     */
    protected function paginatedQuery(Request $request) : LengthAwarePaginator
    {
        $users = User::orderBy(
            $request->input('sortBy') ?? 'firstname',
            $request->input('sortType') ?? 'ASC'
        );

        if ($id = $request->input('id')) {
            $this->filter($users, 'id', $id);
        }

        if ($type = $request->input('type')) {
            $this->filter($users, 'type', $type);
        }

        if ($name = $request->input('name')) {
            $this->filter($users, 'name', $name);
        }

        if ($email = $request->input('email')) {
            $this->filter($users, 'email', $email);
        }

        if ($last_signin = $request->input('last_signin')) {
            $this->filter($users, 'last_signin', $last_signin);
        }

        return $users->paginate($request->input('perPage') ?? 10);
    }

    /**
     * Filter a specific column property
     *
     * @param mixed $users
     * @param string $property
     * @param array $filters
     *
     * @return void
     */
    protected function filter($users, string $property, array $filters)
    {
        foreach ($filters as $keyword => $value) {
            // Needed since LIKE statements requires values to be wrapped by %
            if (in_array($keyword, ['like', 'nlike'])) {
                $users->where(
                    $property, _to_sql_operator($keyword), "%{$value}%"
                );

                return;
            }

            $users->where($property, _to_sql_operator($keyword), "{$value}");
        }
    }
}