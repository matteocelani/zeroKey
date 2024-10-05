import React, { PropsWithChildren, useState } from 'react';
//Importing Hooks
import { useAccount } from 'wagmi';
//Importing Components
import Navbar from '@/layout/navbar';
import Sidebar from '@/layout/sidebar';
import Footer from '@/layout/footer';
import ContentLock from '@/layout/lock';

export default function Layout({ children }: PropsWithChildren) {
  const { isConnecting, isConnected, isDisconnected } = useAccount();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isConnecting || !isConnected || isDisconnected) {
    return (
      <div className="wrapper">
        <Navbar isOpen={isSidebarOpen} toggleOpen={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleOpen={toggleSidebar} />
        <ContentLock />
        <Footer />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Navbar isOpen={isSidebarOpen} toggleOpen={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleOpen={toggleSidebar} />
      <main className="main">{children}</main>
      <Footer />
    </div>
  );
}
