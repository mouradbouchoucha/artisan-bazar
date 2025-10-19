<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthorized. Please login first.',
                'error' => 'AUTHENTICATION_REQUIRED'
            ], 401);
        }

        $user = $request->user();
        $userRole = $user->role ?? 'customer';

        // If no specific roles are required, just check if user is authenticated
        if (empty($roles)) {
            return $next($request);
        }

        // Check if user has one of the required roles
        if (in_array($userRole, $roles)) {
            return $next($request);
        }

        // Log unauthorized access attempt
        \Log::warning('Unauthorized role access attempt', [
            'user_id' => $user->id,
            'user_role' => $userRole,
            'required_roles' => $roles,
            'endpoint' => $request->path(),
            'method' => $request->method()
        ]);

        return response()->json([
            'message' => 'Forbidden. You do not have permission to access this resource.',
            'error' => 'INSUFFICIENT_PERMISSIONS',
            'required_roles' => $roles,
            'your_role' => $userRole
        ], 403);
    }
}
