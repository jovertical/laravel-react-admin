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
        return response()->json('Store Users');
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

        if ($request->input('type')) {
            $users->where('type', $request->input('type'));
        }

        return $users->paginate($request->input('perPage') ?? 10);
    }
}