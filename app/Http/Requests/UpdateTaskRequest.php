<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|in:low,medium,high',
            'due_date' => 'nullable|date',
            'assigned_to' => 'sometimes|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The task title is required.',
            'title.max' => 'The title may not be greater than 255 characters.',
            'priority.in' => 'Invalid priority level selected.',
            'due_date.date' => 'Please enter a valid date.',
            'assigned_to.exists' => 'Selected employee does not exist.',
        ];
    }
}
