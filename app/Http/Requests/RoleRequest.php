<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => 'required|string|max:50|unique:roles,code,' . $this->route('role')?->id,
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Code is required',
            'code.string' => 'Code must be a string',
            'code.max' => 'Code must not exceed 50 characters',
            'code.unique' => 'This code already exists',
            'name.required' => 'Name is required',
            'name.string' => 'Name must be a string',
            'name.max' => 'Name must not exceed 255 characters',
            'slug.string' => 'Slug must be a string',
            'slug.max' => 'Slug must not exceed 255 characters',
            'permissions.array' => 'Permissions must be an array',
            'permissions.*.integer' => 'Each permission must be an integer',
            'permissions.*.exists' => 'One or more permissions are invalid',
        ];
    }
}
