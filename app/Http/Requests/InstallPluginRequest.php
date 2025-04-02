<?php

namespace Pterodactyl\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InstallPluginRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'plugin_name' => 'required|string|max:255',
        ];
    }
}