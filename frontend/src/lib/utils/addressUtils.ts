export function getShortAddress(address: string | `0x${string}`): string {
  if (!address || address.length <= 10) {
    return address;
  }

  const start = address.substring(0, 4);
  const end = address.substring(address.length - 4);

  return `${start}…${end}`;
}

export function isEthAddress(address?: string | `0x${string}`): boolean {
  if (!address) return false;

  const regex = /^0x[a-fA-F0-9]{40}$/;
  return regex.test(address);
}

export function isValidAddress(address: string): boolean {
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  const ensRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+eth$/;
  return ethAddressRegex.test(address) || ensRegex.test(address);
}
