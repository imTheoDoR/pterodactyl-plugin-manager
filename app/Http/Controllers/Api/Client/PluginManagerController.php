<?php

namespace Pterodactyl\Http\Controllers\Api\Client;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Pterodactyl\Actions\Plugins\FetchPlugins;
use Pterodactyl\Facades\Activity;
use Pterodactyl\Http\Requests\InstallPluginRequest;
use Pterodactyl\Models\InstalledPlugin;
use Pterodactyl\Models\Server;
use Pterodactyl\Repositories\Wings\DaemonFileRepository;
use Pterodactyl\Services\PluginInstallerService;

class PluginManagerController extends ClientApiController
{
    private DaemonFileRepository $fileRepository;

    public function __construct(DaemonFileRepository $fileRepository)
    {
        parent::__construct();
        $this->fileRepository = $fileRepository;
    }

    public function index(Request $request, Server $server): JsonResponse
    {
        $query = $request->input('q');
        $page = (int) $request->input('page', 1);
        $perPage = 18;

        $plugins = (new FetchPlugins())->handle($query, $page, $perPage);
        $uuid = $server->uuid;

        $installed = InstalledPlugin::where('server_uuid', $uuid)->pluck('plugin_id')->toArray();

        return response()->json([
            'plugins' => collect($plugins)->map(fn($plugin) => [
                ...$plugin,
                'installed' => in_array($plugin['id'], $installed),
            ]),
            'meta' => [
                'pagination' => [
                    'total' => 1000,
                    'count' => count($plugins),
                    'per_page' => $perPage,
                    'current_page' => $page,
                    'total_pages' => ceil(1000 / $perPage),
                ],
            ],
        ]);
    }

    public function install(InstallPluginRequest $request, Server $server, int $pluginId): JsonResponse
    {
        $uuid = $server->uuid;

        $service = new PluginInstallerService();
        $pluginName = $request->input('plugin_name');
        $service->install($uuid, $pluginId, $pluginName);

        Activity::event('server:plugin.install')
            ->subject($server)
            ->property('name', 'Installed plugin ' . $pluginName)
            ->log();

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }

    public function uninstall(Server $server, int $pluginId): JsonResponse
    {
        $uuid = $server->uuid;
        $plugin = InstalledPlugin::where('server_uuid', $uuid)->where('plugin_id', $pluginId)->firstOrFail();

        $path = 'plugins/' . ltrim($plugin->filename);

        if (str_ends_with($path, '.jar'))
        {
            $this->fileRepository->setServer($server)->deleteFiles('/', [$path]);
        }
        $plugin->delete();

        Activity::event('server:plugin.uninstall')
            ->subject($server)
            ->property('name', 'Deleted plugin ' . $plugin->filename)
            ->log();

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }

    public function installed(Server $server): JsonResponse
    {
        $installed = InstalledPlugin::where('server_uuid', $server->uuid)->get();

        return response()->json([
            'plugins' => $installed,
        ]);
    }

    public function eggs(): JsonResponse
    {
        $path = 'plugin_manager/eggs.json';

        if (!Storage::exists($path)) {
            return response()->json(['error' => 'Config not found.'], 404);
        }

        $json = Storage::get($path);

        $decoded = json_decode($json, true);

        return response()->json($decoded);
    }
}