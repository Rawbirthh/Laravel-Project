<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->hasRole('manager') ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            // 'status_id' => 'required|exists:task_statuses,id',
            'priority_id' => 'required|exists:task_priorities,id',
            'type_id' => 'required|exists:task_types,id',
            'due_date' => 'required|date|after:today',
            'task_type' => 'required|in:individual,group',
            'assigned_to' => 'required|array|min:1',
            'assigned_to.*' => 'exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The task title is required.',
            'title.max' => 'The title may not be greater than 255 characters.',
            // 'status_id.required' => 'The task status is required.',
            // 'status_id.exists' => 'The selected status is invalid.',
            'priority_id.required' => 'The task priority is required.',
            'priority_id.exists' => 'The selected priority is invalid.',
            'type_id.required' => 'The task type is required.',
            'type_id.exists' => 'The selected type is invalid.',
            'due_date.required' => 'The due date is required.',
            'due_date.date' => 'Please enter a valid date.',
            'due_date.after' => 'The due date must be a future date.',
            'assigned_to.required' => 'Please select an employee to assign the task.',
            'assigned_to.array' => 'Invalid selection format.',
            'assigned_to.min' => 'Please select at least one employee.',
            'assigned_to.*.exists' => 'One of the selected employees does not exist.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $taskType = $this->input('task_type');
            $assignedTo = $this->input('assigned_to', []);
            $count = is_array($assignedTo) ? count($assignedTo) : 0;

            if ($taskType === 'individual' && $count > 1) {
                $validator->errors()->add('assigned_to', 'Individual tasks must be assigned to exactly one employee.');
            }

            if ($taskType === 'group' && $count < 2) {
                $validator->errors()->add('assigned_to', 'Group tasks require at least two employees.');
            }
        });
    }
}