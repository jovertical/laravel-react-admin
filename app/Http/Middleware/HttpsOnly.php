<?php

namespace App\Http\Middleware;

use Closure;

class HttpsOnly
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
        if (env('APP_ENV') === 'production' && $request->getScheme() !== 'https') {
            return redirect()->secure($request->getRequestUri());
        }

        return $next($request);
    }
}
