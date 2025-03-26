
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchServerStatus, ServerStatus } from '@/api/serverApi';

type ServerStatusQueryOptions = Omit<
  UseQueryOptions<ServerStatus, Error, ServerStatus, string[]>,
  'queryFn'
>;

export function useServerStatus(options: ServerStatusQueryOptions) {
  return useQuery({
    queryKey: options.queryKey || ['serverStatus'],
    queryFn: fetchServerStatus,
    ...options,
  });
}
