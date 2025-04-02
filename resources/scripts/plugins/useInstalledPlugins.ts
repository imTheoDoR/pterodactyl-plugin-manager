import useSWR from 'swr';
import { installedPlugin } from '@/api/server/plugin';
import { InstalledPluginsParams } from '@/types';
import { AxiosError } from 'axios';

export default function useInstalledPlugins(uuid: string) {
    const swr = useSWR<InstalledPluginsParams[], AxiosError>(
        [`server:installed-plugins`, uuid],
        () => installedPlugin(uuid),
        {
            revalidateOnFocus: false,
        }
    );

    return {
        data: swr.data ?? [],
        loading: !swr.data && swr.isValidating,
        mutate: swr.mutate,
    };
}
