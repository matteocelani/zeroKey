import { useEffect, useState } from 'react';
//Importing icon
import { IoLogoGithub } from 'react-icons/io5';

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <footer className="bg-02 sm:flex sm:items-center sm:justify-between p-4 sm:p-6 xl:p-8 dark:bg-09">
      <p className="mb-4 text-sm text-center text-gray-500 dark:text-gray-300 sm:mb-0">
        &copy; {new Date().getFullYear()} Zero Key.
      </p>
      <div className="flex justify-center items-center space-x-1">
        {/* GitHub */}
        <a
          href="https://github.com/matteocelani/zeroKey"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer dark:text-gray-300 hover:text-black hover:dark:text-black hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <IoLogoGithub className="w-5 h-5" />
          <span className="sr-only">Github</span>
        </a>
      </div>
    </footer>
  );
}
