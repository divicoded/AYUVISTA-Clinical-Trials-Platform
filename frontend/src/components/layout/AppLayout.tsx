import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F4FBF7] text-[#14231E] flex flex-col font-sans selection:bg-[#0B4D3C] selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Top Header — Fixed & elevated */}
      <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Main App Canvas with Fixed Sidebar on Left */}
      <div className="flex-1 flex w-full max-w-full overflow-x-hidden relative">
        <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

        {/* Dynamic Margin to clear fixed left sidebar on md/lg screens */}
        <main className="flex-1 min-w-0 max-w-full overflow-x-hidden transition-all duration-300 md:ml-64 p-3 sm:p-6 lg:p-8">
          <div className="max-w-[1520px] w-full mx-auto space-y-5 sm:space-y-6 pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
