import http, { getPaginationSet, PaginatedResult } from '@/api/http';
import { InstalledPluginsParams, MCPlugin } from '@/types';

interface FetchPluginsParams {
    uuid: string;
    query?: string;
    page?: number;
}

interface InstallPluginParams {
    uuid: string;
    pluginId: number;
    pluginName: string;
}

export async function getPlugins({ uuid, query, page = 1 }: FetchPluginsParams): Promise<PaginatedResult<MCPlugin>> {
    const { data } = await http.get(`/api/client/servers/${uuid}/plugin-manager`, {
        params: {
            q: query,
            page,
        },
    });

    return {
        items: data.plugins,
        pagination: getPaginationSet(data.meta.pagination),
    };
}

export async function installPlugin({ uuid, pluginId, pluginName }: InstallPluginParams): Promise<void> {
    await http.post(`/api/client/servers/${uuid}/plugin-manager/install/${pluginId}`, {
        plugin_name: pluginName,
    });
}

export async function uninstallPlugin(uuid: string, pluginId: number): Promise<void> {
    await http.delete(`/api/client/servers/${uuid}/plugin-manager/uninstall/${pluginId}`);
}

export async function installedPlugin(uuid: string): Promise<InstalledPluginsParams[]> {
    const { data } = await http.get(`/api/client/servers/${uuid}/plugin-manager/installed`);
    return data.plugins;
}

export async function getEggsVisibility(): Promise<Record<number, boolean>> {
    const { data } = await http.get(`/api/client/plugin-manager/eggs`);
    return data;
}
