<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::namespace('Api')->name('api.')->middleware('api')->group(function () {
    Route::namespace('Auth')->name('auth.')->group(function () {
        Route::post('signin', 'SessionsController@signin')->name('signin');

        Route::middleware('auth:api')->group(function () {
            Route::post('signout', 'SessionsController@signout')->name('signout');
            Route::post('refresh', 'SessionsController@refresh')->name('refresh');
            Route::post('user', 'SessionsController@user')->name('user');
        });
    });
});
