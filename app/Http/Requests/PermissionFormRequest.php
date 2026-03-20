<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class PermissionFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $permissionId = $this->route('permission')?->id;

        return [
            'permission_name' => 'required|string|max:255|unique:permissions,permission_name,' . $permissionId,
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'permission_name.required' => 'Permission name is required.',
            'permission_name.string' => 'Permission name must be a string.',
            'permission_name.max' => 'Permission name must not exceed 255 characters.',
            'permission_name.unique' => 'This permission name already exists.',
            'display_name.required' => 'Display name is required.',
            'display_name.string' => 'Display name must be a string.',
            'display_name.max' => 'Display name must not exceed 255 characters.',
            'description.string' => 'Description must be a string.',
            'description.max' => 'Description must not exceed 1000 characters.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            back()->withErrors($validator->errors())->withInput()
        );
    }
}
