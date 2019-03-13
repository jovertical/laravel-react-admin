<?php

namespace App\Http\Middleware;

use Closure;

class Localize
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($locale = $request->segment(1)) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}
