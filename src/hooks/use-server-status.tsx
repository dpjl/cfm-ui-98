
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchServerStatus, ServerStatus } from '@/api/serverApi';

// Make queryKey optional in the type definition by using Partial<Pick<>> for the queryKey property
type ServerStatusQueryOptions = Omit<
  UseQueryOptions<ServerStatus, Error, ServerStatus, string[]>,
  'queryFn'
> & {
  queryKey?: string[];
};

export function useServerStatus(options: ServerStatusQueryOptions = {}) {
  const query = useQuery({
    queryKey: options.queryKey || ['serverStatus'],
    queryFn: fetchServerStatus,
    ...options,
  });

  return {
    ...query,
    status: query.data,
    isLoading: query.isPending
  };
}
