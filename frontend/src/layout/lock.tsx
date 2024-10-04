// Importing Next
import Link from 'next/link';
// Importing components
import ConnectButton from '@/components/ConnectButton';

export default function ContentLock() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4 md:gap-4">
      <ConnectButton />
      <p className="text-center text-sm sm:text-base">Or</p>
      <Link
        href="/zero"
        className="w-40 flex items-center justify-center text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg bg-primary"
      >
        Zero Key
      </Link>
    </div>
  );
}
