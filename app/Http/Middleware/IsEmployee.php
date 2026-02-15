<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsEmployee
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();
        
        if (!$user) {
            abort(403, 'Unauthorized access.');
        }

        // Load roles relationship
        $user->load('roles');

        // Allow access if user has no roles or has employee role
        if ($user->roles->isEmpty() || $user->hasRole('employee')) {
            return $next($request);
        }

        abort(403, 'Unauthorized access.');
    }
}
