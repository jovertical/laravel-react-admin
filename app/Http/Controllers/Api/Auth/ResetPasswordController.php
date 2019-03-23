<?php

namespace App\Http\Controllers\Api\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
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
    public function reset(Request $request) : JsonResponse
    {
        return response()->json('Resetting...');
    }
}
