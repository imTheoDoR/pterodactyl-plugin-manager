<?php

namespace Pterodactyl\Models;

use Illuminate\Database\Eloquent\Model;

class InstalledPlugin extends Model
{
    protected $fillable = [
        'server_uuid',
        'plugin_id',
        'plugin_name',
        'filename'
    ];
}