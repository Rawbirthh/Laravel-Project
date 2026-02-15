<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserAllRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
            'departments' => 'nullable|array',
            'departments.*' => 'exists:departments,id',
        ];
    }

    public function messages(): array
    {
        return [
            'roles.array' => 'Roles must be an array.',
            'roles.*.exists' => 'Selected role is invalid.',
            'departments.array' => 'Departments must be an array.',
            'departments.*.exists' => 'Selected department is invalid.',
        ];
    }
}
