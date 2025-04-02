import React, { useEffect, useMemo, useState } from 'react';
import { ServerContext } from '@/state/server';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';
import Fade from '@/components/elements/Fade';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { installPlugin, uninstallPlugin } from '@/api/server/plugin';
import Input from '@/components/elements/Input';
import Spinner from '@/components/elements/Spinner';
import { Button as OButton } from '@/components/elements/button/index';
import Button from '@/components/elements/Button';
import { Download, ExternalLink, Trash2 } from 'lucide-react';
import PaginationFooter from '@/components/elements/table/PaginationFooter';
import usePlugins from '@/plugins/usePlugins';
import useInstalledPlugins from '@/plugins/useInstalledPlugins';
import { enrichInstalledPlugins } from '@/helpers/enrich-installed-plugins';

const PluginManagerContainer = () => {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { data: plugins, pagination, loading, mutate: pluginMutate } = usePlugins({ uuid, query, page });
    const { data: installedPlugins = [], mutate: installedMutate } = useInstalledPlugins(uuid);

    const handleInstall = async (pluginId: number, pluginName: string) => {
        await installPlugin({ uuid, pluginId, pluginName });
        pluginMutate();
        installedMutate();
    };

    const handleUninstall = async (pluginId: number) => {
        await uninstallPlugin(uuid, pluginId);
        pluginMutate();
        installedMutate();
    };

    useEffect(() => {
        setPage(1);
    }, [query]);

    const enrichedInstalledPlugins = useMemo(() => {
        return enrichInstalledPlugins(installedPlugins, plugins);
    }, [installedPlugins, plugins]);

    const availablePlugins = plugins.filter(
        (plugin) => !installedPlugins.some((installed) => installed.plugin_id === plugin.id)
    );

    return (
        <ServerContentBlock title={'Plugin Manager'}>
            <FlashMessageRender byKey={'plugin_manager'} css={tw`mb-4`} />
            <Fade timeout={150}>
                <>
                    <div className='mb-4'>
                        <Input
                            type='text'
                            value={query}
                            placeholder='Search for plugins...'
                            onChange={(e) => setQuery(e.target.value.trim())}
                        />
                    </div>

                    {loading && <Spinner size='large' centered />}

                    {!loading && installedPlugins.length > 0 && (
                        <>
                            <h3 className='text-white text-xl font-bold mt-4 mb-2'>Installed Plugins</h3>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                                {enrichedInstalledPlugins.map((plugin) => (
                                    <div
                                        key={plugin.id}
                                        className='border border-neutral-600 p-4 shadow-sm bg-neutral-700 flex flex-col justify-between'
                                    >
                                        <div>
                                            <div className='flex space-x-2'>
                                                <img
                                                    src={`https://api.spiget.org/v2/resources/${plugin.plugin_id}/icon`}
                                                    alt={plugin.plugin_name}
                                                    className='w-10 h-10 rounded bg-neutral-800 object-cover'
                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                />
                                                <div className='text-white font-semibold'>{plugin.plugin_name}</div>
                                            </div>
                                            {plugin.tag && plugin.tag.length > 0 && (
                                                <p className='mt-2 mb-4'>{plugin.tag}</p>
                                            )}
                                            {plugin.testedVersions && plugin.testedVersions.length > 0 && (
                                                <p className='text-sm '>
                                                    Tested versions:{' '}
                                                    <span className='font-semibold block'>
                                                        {plugin.testedVersions.join(', ')}
                                                    </span>
                                                </p>
                                            )}
                                        </div>

                                        <div className='flex items-center space-x-2 justify-end w-full mt-6'>
                                            <a
                                                target='_blank'
                                                rel='noreferrer'
                                                href={`https://www.spigotmc.org/resources/${plugin.plugin_id}`}
                                            >
                                                <Button size='xsmall' isSecondary>
                                                    <div className='flex items-center space-x-1'>
                                                        <ExternalLink size={20} />
                                                        <span>Details</span>
                                                    </div>
                                                </Button>
                                            </a>
                                            <OButton
                                                size={OButton.Sizes.Small}
                                                className='space-x-1 !bg-red-500 hover:!bg-red-600 duration-200'
                                                onClick={() => handleUninstall(plugin.plugin_id)}
                                            >
                                                <Trash2 size={20} />
                                                <span>Uninstall</span>
                                            </OButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {!loading && <h3 className='text-white text-xl font-bold mt-8 mb-2'>Available Plugins</h3>}

                    {availablePlugins.length === 0 && !loading && (
                        <p className='text-center text-neutral-400 mt-6'>No available plugins.</p>
                    )}

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                        {availablePlugins.map((plugin) => (
                            <div
                                key={plugin.id}
                                className='border border-neutral-600 p-4 shadow-sm bg-neutral-700 flex flex-col justify-between'
                            >
                                <div>
                                    <div className='flex space-x-2'>
                                        <img
                                            src={`https://api.spiget.org/v2/resources/${plugin.id}/icon`}
                                            alt={plugin.name}
                                            className='w-10 h-10 rounded bg-neutral-800 object-cover'
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                        <div className='text-white font-semibold'>{plugin.name}</div>
                                    </div>
                                    {plugin.tag && plugin.tag.length > 0 && <p className='mt-2 mb-4'>{plugin.tag}</p>}
                                    {plugin.testedVersions && plugin.testedVersions.length > 0 && (
                                        <p className='text-sm '>
                                            Tested versions:{' '}
                                            <span className='font-semibold block'>
                                                {plugin.testedVersions.join(', ')}
                                            </span>
                                        </p>
                                    )}
                                </div>

                                <div className='flex items-center space-x-2 justify-end w-full mt-6'>
                                    <a
                                        target='_blank'
                                        rel='noreferrer'
                                        href={`https://www.spigotmc.org/resources/${plugin.id}`}
                                    >
                                        <Button size='xsmall' isSecondary>
                                            <div className='flex items-center space-x-1'>
                                                <ExternalLink size={20} />
                                                <span>Details</span>
                                            </div>
                                        </Button>
                                    </a>
                                    {!plugin.external && (
                                        <OButton
                                            variant={OButton.Variants.Primary}
                                            size={OButton.Sizes.Small}
                                            onClick={() => handleInstall(plugin.id, plugin.name)}
                                            className='space-x-1 whitespace-nowrap'
                                        >
                                            <Download size={20} />
                                            <span>Install</span>
                                        </OButton>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {pagination && pagination.totalPages > 1 && (
                        <PaginationFooter pagination={pagination} onPageSelect={(newPage) => setPage(newPage)} />
                    )}
                </>
            </Fade>
        </ServerContentBlock>
    );
};

export default PluginManagerContainer;
