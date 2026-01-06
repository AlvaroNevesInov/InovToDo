<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        Log::info('ProfileUpdateRequest validation started', [
            'has_file' => $this->hasFile('avatar'),
            'avatar_data' => $this->file('avatar') ? [
                'size' => $this->file('avatar')->getSize(),
                'mime' => $this->file('avatar')->getMimeType(),
                'extension' => $this->file('avatar')->getClientOriginalExtension(),
            ] : null,
        ]);

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif', 'max:2048'],
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        Log::error('ProfileUpdateRequest validation failed', [
            'errors' => $validator->errors()->toArray(),
        ]);

        parent::failedValidation($validator);
    }
}
