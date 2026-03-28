<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class TaskPriorityFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $priorityId = $this->route('taskPriority')?->id;

        return [
            'name' => 'required|string|max:255|unique:task_priorities,name,' . $priorityId,
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Priority name is required.',
            'name.string' => 'Priority name must be a string.',
            'name.max' => 'Priority name must not exceed 255 characters.',
            'name.unique' => 'This priority name already exists.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            back()->withErrors($validator->errors())->withInput()
        );
    }
}
