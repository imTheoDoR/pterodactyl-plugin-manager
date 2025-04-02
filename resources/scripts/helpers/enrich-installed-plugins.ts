import { InstalledPluginsParams, MCPlugin } from '@/types';

export function enrichInstalledPlugins(
    installed: InstalledPluginsParams[],
    available: MCPlugin[]
): (InstalledPluginsParams & { tag?: string; testedVersions?: string[] })[] {
    return installed.map((installedPlugin) => {
        const match = available.find((p) => p.id === installedPlugin.plugin_id);

        return {
            ...installedPlugin,
            tag: match?.tag,
            testedVersions: match?.testedVersions,
        };
    });
}
