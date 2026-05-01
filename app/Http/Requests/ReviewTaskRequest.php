<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => 'required|in:approve,reject',
            'comment' => 'nullable|required_if:action,reject|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'action.required' => 'Please select an action.',
            'action.in' => 'Invalid action selected.',
            'comment.required_if' => 'Please provide a reason for rejection.',
            'comment.max' => 'Comment must not exceed 1000 characters.',
        ];
    }
}