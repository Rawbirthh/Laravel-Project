<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserDepartmentsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'departments' => 'nullable|array',
            'departments.*' => 'exists:departments,id',
        ];
    }

    public function messages(): array
    {
        return [
            'departments.array' => 'Departments must be an array.',
            'departments.*.exists' => 'Selected department is invalid.',
        ];
    }
}
