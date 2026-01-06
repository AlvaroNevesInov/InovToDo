<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('tasks.index');
    })->name('dashboard');

    // Task routes com rate limiting (60 requests por minuto)
    Route::middleware('throttle:60,1')->group(function () {
        Route::resource('tasks', TaskController::class);
        Route::patch('tasks/{task}/toggle', [TaskController::class, 'toggleComplete'])->name('tasks.toggle');
    });

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Debug route (temporary - remove after fixing)
    Route::get('/debug/storage', function () {
        $logFile = storage_path('logs/laravel.log');

        // Test writing to log
        Log::info('DEBUG: Test log entry from /debug/storage route');

        $info = [
            'storage_link_exists' => is_link(public_path('storage')),
            'storage_link_target' => is_link(public_path('storage')) ? readlink(public_path('storage')) : 'N/A',
            'avatars_dir_exists' => is_dir(storage_path('app/public/avatars')),
            'avatars_dir_writable' => is_writable(storage_path('app/public/avatars')),
            'storage_path' => storage_path('app/public/avatars'),
            'public_storage_path' => public_path('storage'),
            'gd_enabled' => extension_loaded('gd'),
            'php_version' => PHP_VERSION,
            'log_file_path' => $logFile,
            'log_file_exists' => file_exists($logFile),
            'log_file_size' => file_exists($logFile) ? filesize($logFile) : 0,
            'log_dir_writable' => is_writable(storage_path('logs')),
            'recent_logs' => [],
        ];

        // Get recent logs
        if (file_exists($logFile)) {
            $lines = file($logFile);
            $info['recent_logs'] = array_slice($lines, -100); // Increase to 100 lines
            $info['total_log_lines'] = count($lines);
        }

        return response()->json($info, 200, [], JSON_PRETTY_PRINT);
    })->name('debug.storage');
});

require __DIR__.'/auth.php';
