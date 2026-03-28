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
            'status_id' => 'sometimes|required|exists:task_statuses,id',
            'priority_id' => 'sometimes|required|exists:task_priorities,id',
            'type_id' => 'nullable|exists:task_types,id',
            'due_date' => 'nullable|date',
            'assigned_to' => 'sometimes|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The task title is required.',
            'title.max' => 'The title may not be greater than 255 characters.',
            'status_id.required' => 'The task status is required.',
            'status_id.exists' => 'The selected status is invalid.',
            'priority_id.required' => 'The task priority is required.',
            'priority_id.exists' => 'The selected priority is invalid.',
            'type_id.exists' => 'The selected type is invalid.',
            'due_date.date' => 'Please enter a valid date.',
            'assigned_to.exists' => 'Selected employee does not exist.',
        ];
    }
}
