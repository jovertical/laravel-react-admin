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

Route::namespace('Api')->name('api.')->group(function () {
    Route::namespace('Auth')->name('auth.')->prefix('auth')->group(function () {
        Route::post('identify', 'SessionsController@identify')->name('identify');
        Route::post('signin', 'SessionsController@signin')->name('signin');
        Route::post('token', 'SessionsController@token')->name('token');

        Route::middleware('auth:api')->group(function () {
            Route::post('signout', 'SessionsController@signout')->name('signout');
            Route::post('refresh', 'SessionsController@refresh')->name('refresh');
            Route::post('user', 'SessionsController@user')->name('user');
        });

        Route::name('password.')->prefix('password')->group(function() {
            Route::post('request', 'ForgotPasswordController@sendResetLinkEmail')->name('request');
            Route::post('reset/{token}', 'ResetPasswordController@reset')->name('reset');
        });
    });

    Route::middleware('auth:api')->group(function () {
        Route::resource('users', 'UsersController', ['except' => ['edit', 'create']]);
        Route::patch('users/{user}/restore', 'UsersController@restore')->name('users.restore');
        Route::delete('users/{idCollectionString}/multiple', 'UsersController@destroyMultiple')
            ->name('users.destroy-multiple');
        Route::patch('users/{idCollectionString}/restore/multiple', 'UsersController@restoreMultiple')
            ->name('users.restore-multiple');
    });
});