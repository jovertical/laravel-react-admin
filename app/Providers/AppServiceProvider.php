<?php

namespace App\Providers;

use File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);

        view()->composer('*', function($view) {
            $locale = app()->getLocale();

            $navigation = require resource_path("lang/{$locale}/navigation.php");
            $table = require resource_path("lang/{$locale}/table.php");

            $view->with([
                'lang' => compact(['navigation', 'table'])
            ]);
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
