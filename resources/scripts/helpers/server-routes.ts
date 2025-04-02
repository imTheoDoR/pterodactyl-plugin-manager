import { ServerRouteDefinition } from '@/routers/routes';

export default function resolveServerRoutes(
    routes: ServerRouteDefinition[],
    eggId?: number,
    eggsVisibility?: Record<number, boolean>
): ServerRouteDefinition[] {
    return routes.filter((route) => {
        if (route.path === '/plugin-manager') {
            return eggId && eggsVisibility?.[eggId] === true;
        }

        return true;
    });
}
