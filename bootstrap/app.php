<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Security headers middleware - adiciona headers de segurança
        $middleware->append(\App\Http\Middleware\SecurityHeaders::class);

        // Force HTTPS middleware - redireciona HTTP para HTTPS em produção
        $middleware->append(\App\Http\Middleware\ForceHttps::class);

        // Cache headers middleware - otimiza cache de assets
        $middleware->append(\App\Http\Middleware\CacheHeaders::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
