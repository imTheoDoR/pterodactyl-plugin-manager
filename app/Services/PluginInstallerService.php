<?php

namespace Pterodactyl\Services;

use Pterodactyl\Models\InstalledPlugin;
use Pterodactyl\Models\Server;
use Pterodactyl\Repositories\Wings\DaemonFileRepository;

class PluginInstallerService
{
    public function install(string $uuid, int $pluginId, string $pluginName, ?string $version = null): void
    {
        $server = Server::where('uuid', $uuid)->firstOrFail();
        $filename = $pluginName . '-' . $pluginId . '.jar';

        $url = "https://cdn.spiget.org/file/spiget-resources/{$pluginId}.jar";

        app(DaemonFileRepository::class)->setServer($server)->pull($url, '/plugins', [
            'filename' => $filename,
            'use_header' => false,
            'foreground' => true,
        ]);

        InstalledPlugin::create([
            'server_uuid' => $uuid,
            'plugin_id' => $pluginId,
            'plugin_name' => $pluginName,
            'filename' => $filename,
        ]);
    }
}