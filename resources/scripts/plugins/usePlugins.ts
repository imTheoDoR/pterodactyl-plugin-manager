import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import { getPlugins } from '@/api/server/plugin';
import { MCPlugin } from '@/types';
import { AxiosError } from 'axios';

interface UsePluginsOptions {
    uuid: string;
    query?: string;
    page?: number;
}

export default function usePlugins({ uuid, query = '', page = 1 }: UsePluginsOptions) {
    const key = [`server:plugins`, uuid, query, page];
    const swr = useSWR<PaginatedResult<MCPlugin>, AxiosError>(key, () => getPlugins({ uuid, query, page }), {
        revalidateOnFocus: false,
    });

    return {
        data: swr.data?.items || [],
        pagination: swr.data?.pagination,
        loading: !swr.data && swr.isValidating,
        mutate: swr.mutate,
    };
}
