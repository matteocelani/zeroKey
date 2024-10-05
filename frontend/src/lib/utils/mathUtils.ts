import { formatEther } from 'viem';

export function formatBalance(value: bigint): string {
  const formattedEther = formatEther(value);
  const [integerPart, fractionalPart] = formattedEther.split('.');

  if (!fractionalPart) {
    return formattedEther;
  }

  let significantDigits = 0;
  let formattedFraction = '';

  for (let i = 0; i < fractionalPart.length; i++) {
    if (fractionalPart[i] !== '0' || significantDigits > 0) {
      formattedFraction += fractionalPart[i];
      significantDigits++;
      if (significantDigits === 3) break;
    } else {
      formattedFraction += fractionalPart[i];
    }
  }

  return `${integerPart}.${formattedFraction}`;
}
