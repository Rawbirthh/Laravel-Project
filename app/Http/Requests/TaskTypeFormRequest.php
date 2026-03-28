<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class TaskTypeFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $typeId = $this->route('taskType')?->id;

        return [
            'name' => 'required|string|max:255|unique:task_types,name,' . $typeId,
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Type name is required.',
            'name.string' => 'Type name must be a string.',
            'name.max' => 'Type name must not exceed 255 characters.',
            'name.unique' => 'This type name already exists.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            back()->withErrors($validator->errors())->withInput()
        );
    }
}
