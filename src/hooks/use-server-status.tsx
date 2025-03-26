
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchServerStatus, ServerStatus } from '@/api/serverApi';

type ServerStatusQueryOptions = Omit<
  UseQueryOptions<ServerStatus, Error, ServerStatus, string[]>,
  'queryFn'
>;

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
