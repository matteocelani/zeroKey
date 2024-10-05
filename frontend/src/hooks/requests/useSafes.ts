import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { safeFetcher } from '@/lib/utils/fetcher';

type SafeAddress = string;

interface ChainSafes {
  [chainId: number]: SafeAddress[];
}

export function useSafes() {
  const { address } = useAccount();

  return useQuery<SafeAddress[], Error>({
    queryKey: ['safes', address],
    queryFn: async () => {
      if (!address) throw new Error('No address found');
      const chainSafes: ChainSafes = await safeFetcher.getSafes(address);
      // Test only on Base network (chainId 8453)
      return chainSafes[8453] || [];
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
