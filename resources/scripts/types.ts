export interface MCPlugin {
    id: number;
    name: string;
    external: boolean;
    testedVersions?: string[];
    tag?: string;
    updateDate: number;
    installed: boolean;
}

export interface InstalledPluginsParams {
    id: number;
    server_uuid: string;
    plugin_id: number;
    plugin_name: string;
    filename: string;
    created_at: Date;
    updated_at: Date;
}
