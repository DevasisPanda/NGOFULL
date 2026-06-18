import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../ngo-management-system/server/routers';

export const trpc = createTRPCReact<AppRouter>();



