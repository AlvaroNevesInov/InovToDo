<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CacheHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Aplicar cache headers apenas para assets estáticos versionados
        $path = $request->path();

        if ($this->shouldCache($path)) {
            // Cache por 1 ano para assets versionados (build/)
            $response->headers->set('Cache-Control', 'public, max-age=31536000, immutable');
        } elseif ($this->isStaticAsset($path)) {
            // Cache por 1 semana para outros assets estáticos
            $response->headers->set('Cache-Control', 'public, max-age=604800');
        } else {
            // Sem cache para páginas dinâmicas
            $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate');
            $response->headers->set('Pragma', 'no-cache');
            $response->headers->set('Expires', '0');
        }

        return $response;
    }

    /**
     * Verifica se o recurso deve ter cache longo (assets versionados)
     */
    private function shouldCache(string $path): bool
    {
        return str_starts_with($path, 'build/') ||
               str_contains($path, '.css?id=') ||
               str_contains($path, '.js?id=');
    }

    /**
     * Verifica se é um asset estático
     */
    private function isStaticAsset(string $path): bool
    {
        $staticExtensions = ['css', 'js', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'woff', 'woff2', 'ttf', 'eot', 'ico'];

        foreach ($staticExtensions as $ext) {
            if (str_ends_with($path, '.' . $ext)) {
                return true;
            }
        }

        return false;
    }
}
