<?php

namespace Pterodactyl\Actions\Plugins;

use Illuminate\Support\Facades\Http;

class FetchPlugins
{
    public function handle(?string $query = null, int $page = 1, int $size = 18): array
    {
        $url = $query
            ? "https://api.spiget.org/v2/search/resources/" . urlencode($query) . "?page=$page&size=$size"
            : "https://api.spiget.org/v2/resources/free?page=$page&size=$size";


        $response = Http::withHeaders([
            'User-Agent' => 'PluginManager/1.0',
        ])->get($url);

        $results = $response->successful() ? $response->json() : [];

        return array_values($results);
    }
}