<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class TaskStatusFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $statusId = $this->route('taskStatus')?->id;

        return [
            'name' => 'required|string|max:255|unique:task_statuses,name,' . $statusId,
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Status name is required.',
            'name.string' => 'Status name must be a string.',
            'name.max' => 'Status name must not exceed 255 characters.',
            'name.unique' => 'This status name already exists.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            back()->withErrors($validator->errors())->withInput()
        );
    }
}
