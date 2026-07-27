import { createTRPCReact } from '@trpc/react-query';

// AppRouter type is inferred from the tRPC server at runtime via superjson transformer.
// Using 'any' here keeps the frontend buildable independently from the backend repo.
// All query/mutation paths are validated at runtime by the tRPC server's zod schemas.
export const trpc = createTRPCReact<any>();



