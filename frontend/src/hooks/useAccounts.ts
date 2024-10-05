import { useCallback, useMemo } from 'react';
import axios from 'axios';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

const BASE_URL = 'https://safe-client.safe.global';
const FIVE_MINUTES = 5 * 60 * 1000;

interface SafeAccountsResponse {
  [chainId: string]: string[];
}

export function useAccounts(ownerAddress: string) {
  const defaultQueryOptions = useMemo(
    () => ({
      staleTime: FIVE_MINUTES,
      gcTime: FIVE_MINUTES,
      retry: 3,
    }),
    []
  );

  const fetchAccounts = useCallback(async (): Promise<SafeAccountsResponse> => {
    const response = await axios.get(
      `${BASE_URL}/v1/owners/${ownerAddress}/safes`
    );
    return response.data;
  }, [ownerAddress]);

  const useGetAccounts = (
    options?: UseQueryOptions<SafeAccountsResponse, Error>
  ) => {
    return useQuery<SafeAccountsResponse, Error>({
      queryKey: ['accounts', ownerAddress],
      queryFn: fetchAccounts,
      ...defaultQueryOptions,
      ...options,
    });
  };

  return { useGetAccounts };
}
