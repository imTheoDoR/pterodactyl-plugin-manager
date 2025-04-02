<?php

namespace Pterodactyl\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Prologue\Alerts\Facades\Alert;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Models\Egg;

class PluginManagerController extends Controller
{
    protected string $configPath = 'plugin_manager/eggs.json';

    public function index()
    {
        $eggs = Egg::select('id', 'name')->get();

        $config = [];
        if (Storage::disk('local')->exists($this->configPath))
        {
            $config = json_decode(Storage::disk('local')->get($this->configPath), true);
        }

        return view('admin.plugin_manager.index', [
            'eggs' => $eggs,
            'config' => $config,
        ]);
    }

    public function update(Request $request)
    {
        $eggStates = [];

        foreach ($request->input('eggs', []) as $eggId => $state)
        {
            $eggStates[(int) $eggId] = $state === 'true';
        }

        Storage::disk('local')->put($this->configPath, json_encode($eggStates, JSON_PRETTY_PRINT));

        Alert::success('Success! Egg plugin configuration updated successfully.')->flash();
        return redirect()->route('admin.plugin_manager');
    }
}
