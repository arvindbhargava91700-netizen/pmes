<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class storeProjectStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
        'name' => 'required|string|unique:project_status_masters,name',
        'color' => 'nullable|string',
        'sort_order' => 'nullable|integer'
       ];
    }
}
