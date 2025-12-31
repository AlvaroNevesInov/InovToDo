@props(['messages', 'for' => null])

@php
    $errorId = $for ? $for . '-error' : null;
@endphp

@if ($messages)
    <ul {{ $attributes->merge(['class' => 'text-sm text-red-600 dark:text-red-400 space-y-1', 'id' => $errorId]) }}>
        @foreach ((array) $messages as $message)
            <li>{{ $message }}</li>
        @endforeach
    </ul>
@endif
