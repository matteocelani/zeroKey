import { base, baseSepolia, mainnet, sepolia } from 'viem/chains';
import { Address, Chain, createPublicClient, encodePacked, http, keccak256, namehash, parseAbi } from 'viem';
import { useQuery } from '@tanstack/react-query';

/**
 * isBase
 *  - Checks if the paymaster operations chain id is valid
 *  - Only allows the Base and Base Sepolia chain ids
 */
function isBase({
  chainId,
  isMainnetOnly = false,
}: {
  chainId: number;
  isMainnetOnly?: boolean; // If the chainId check is only allowed on mainnet
}): boolean {
  // If only Base mainnet
  if (isMainnetOnly && chainId === base.id) {
    return true;
  }
  // If only Base or Base Sepolia
  if (!isMainnetOnly && (chainId === baseSepolia.id || chainId === base.id)) {
    return true;
  }
  return false;
}

/**
 * isEthereum
 *  - Checks if the chain is mainnet or sepolia
 */
function isEthereum({
  chainId,
  isMainnetOnly = false,
}: {
  chainId: number;
  isMainnetOnly?: boolean; // If the chainId check is only allowed on mainnet
}): boolean {
  // If only ETH mainnet
  if (isMainnetOnly && chainId === mainnet.id) {
    return true;
  }
  // If only ETH or ETH Sepolia
  if (!isMainnetOnly && (chainId === sepolia.id || chainId === mainnet.id)) {
    return true;
  }
  return false;
}

function getChainPublicClient(chain: Chain) {
  return createPublicClient({
    chain: chain,
    transport: http(),
  });
}

const RESOLVER_ADDRESSES_BY_CHAIN_ID: Record<number, Address> = {
  [baseSepolia.id]: '0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA',
  [base.id]: '0xC6d566A56A1aFf6508b41f6c90ff131615583BCD',
};

type Basename = `${string}.base.eth` | `${string}.basetest.eth`;

type GetName = {
  address: Address;
  chain?: Chain;
};

type GetNameReturnType = string | Basename | null

const convertChainIdToCoinType = (chainId: number): string => {
  // L1 resolvers to addr
  if (chainId === mainnet.id) {
    return 'addr';
  }

  const cointype = (0x80000000 | chainId) >>> 0;
  return cointype.toString(16).toLocaleUpperCase();
};

const convertReverseNodeToBytes = (
  address: Address,
  chainId: number,
) => {
  const addressFormatted = address.toLocaleLowerCase() as Address;
  const addressNode = keccak256(addressFormatted.substring(2) as Address);
  const chainCoinType = convertChainIdToCoinType(chainId);
  const baseReverseNode = namehash(
    `${chainCoinType.toLocaleUpperCase()}.reverse`,
  );
  const addressReverseNode = keccak256(
    encodePacked(['bytes32', 'bytes32'], [baseReverseNode, addressNode]),
  );
  return addressReverseNode;
};

/**
 * An asynchronous function to fetch the Ethereum Name Service (ENS)
 * name for a given Ethereum address. It returns the ENS name if it exists,
 * or null if it doesn't or in case of an error.
 */
const getName = async ({
  address,
  chain = mainnet,
}: GetName): Promise<GetNameReturnType> => {
  const chainIsBase = isBase({ chainId: chain.id });
  const chainIsEthereum = isEthereum({ chainId: chain.id });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;

  if (!chainSupportsUniversalResolver) {
    return Promise.reject(
      'ChainId not supported, name resolution is only supported on Ethereum and Base.',
    );
  }

  let client = getChainPublicClient(chain);

  if (chainIsBase) {
    const addressReverseNode = convertReverseNodeToBytes(address, base.id);
    try {
      const basename = await client.readContract({
        abi: parseAbi(['function name(bytes32 node) external view returns (string)']),
        address: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
        functionName: 'name',
        args: [addressReverseNode],
      });
      if (basename) {
        return basename as Basename;
      }
    } catch (_error) {
      // This is a best effort attempt, so we don't need to do anything here.
    }
  }

  // Default to mainnet
  client = getChainPublicClient(mainnet);
  // ENS username
  const ensName = await client.getEnsName({
    address,
  });

  return ensName ?? null;
};

type UseNameOptions = {
  address: Address; // The Ethereum address for which the ENS name is to be fetched.
  chain?: Chain; // Optional chain for domain resolution
};

type UseQueryOptions = {
  enabled?: boolean;
  cacheTime?: number;
};

/**
 * It leverages the `@tanstack/react-query` hook for fetching and optionally caching the ENS name
 * @returns An object containing:
 *  - `ensName`: The fetched ENS name for the provided address, or null if not found or in case of an error.
 *  - `{UseQueryResult}`: The rest of useQuery return values. including isLoading, isError, error, isFetching, refetch, etc.
 */
export const useBaseName = (
  { address, chain = mainnet }: UseNameOptions,
  queryOptions?: UseQueryOptions,
) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const ensActionKey = `ens-name-${address}-${chain.id}`;
  return useQuery<GetNameReturnType>({
    queryKey: ['useName', ensActionKey],
    queryFn: async () => {
      return await getName({ address, chain });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
};