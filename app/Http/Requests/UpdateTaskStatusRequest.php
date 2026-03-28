<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status_id' => 'required|exists:task_statuses,id',
        ];
    }

    public function messages(): array
    {
        return [
            'status_id.required' => 'Please select a status.',
            'status_id.exists' => 'Invalid status selected.',
        ];
    }
}
