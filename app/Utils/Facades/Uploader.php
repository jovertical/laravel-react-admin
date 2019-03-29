<?php

namespace App\Utils\Facades;

use Illuminate\Support\Facades\Facade;

class Uploader extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'uploader';
    }
}
