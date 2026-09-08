import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FlaskConical,
  Building2,
  Users,
  Eye,
  CheckSquare,
  ShieldAlert,
  Scale,
  Network,
  FileSpreadsheet,
  History,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { role } = useAuth();

  const navigationItems = [
    { name: 'Command Center', path: '/', icon: LayoutDashboard, roles: ['ALL'] },
    { name: 'Studies', path: '/studies', icon: FlaskConical, roles: ['ALL'] },
    { name: 'Sites', path: '/sites', icon: Building2, roles: ['ALL'] },
    { name: 'Participants', path: '/participants', icon: Users, roles: ['ALL'] },
    { name: 'Monitoring', path: '/monitoring', icon: Eye, roles: ['ADMIN', 'MONITOR', 'PRINCIPAL_INVESTIGATOR', 'LEADERSHIP'] },
    { name: 'Data Quality', path: '/data-quality', icon: CheckSquare, roles: ['ADMIN', 'STUDY_COORDINATOR', 'MONITOR', 'PRINCIPAL_INVESTIGATOR', 'LEADERSHIP'] },
    { name: 'Safety / PV', path: '/safety', icon: ShieldAlert, roles: ['ADMIN', 'PHARMACOVIGILANCE', 'PRINCIPAL_INVESTIGATOR', 'ETHICS', 'LEADERSHIP'] },
    { name: 'Ethics & Regulatory', path: '/ethics', icon: Scale, roles: ['ADMIN', 'ETHICS', 'PRINCIPAL_INVESTIGATOR', 'LEADERSHIP'] },
    { name: 'Interoperability', path: '/interop', icon: Network, roles: ['ADMIN', 'PRINCIPAL_INVESTIGATOR', 'LEADERSHIP'] },
    { name: 'Reports & Exports', path: '/reports', icon: FileSpreadsheet, roles: ['ALL'] },
    { name: 'Audit Trail', path: '/audit', icon: History, roles: ['ALL'] },
    { name: 'Tasks', path: '/tasks', icon: ClipboardList, roles: ['ALL'] },
    { name: 'ALCOA+ Integrity', path: '/data-integrity', icon: CheckCircle2, roles: ['ALL'] },
    { name: 'Privacy Controls', path: '/privacy-governance', icon: Lock, roles: ['ALL'] },
  ];

  const isPermitted = (allowed: string[]) => {
    if (allowed.includes('ALL')) return true;
    if (role === 'ADMIN') return true;
    return allowed.includes(role);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      <aside
        className={`fixed top-20 bottom-0 left-0 z-40 md:z-20 glass-panel border-r border-[#E2EEE7]/80 flex flex-col transition-all duration-300 select-none ${
          mobileOpen ? 'translate-x-0 w-72 max-w-[85vw] shadow-2xl' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Navigation List - Hidden scrollbar but smoothly scrollable if screen is very short */}
        <div className="flex-1 py-4 overflow-y-auto space-y-1.5 px-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {!collapsed && (
            <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#526D61] font-mono flex items-center justify-between">
              <span>Clinical Operations</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          )}
          {navigationItems.map((item) => {
            const permitted = isPermitted(item.roles);
            if (!permitted) return null;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                onClick={() => {
                  if (onCloseMobile) onCloseMobile();
                }}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0B4D3C] to-[#0E5E4A] text-white shadow-lg shadow-[#0B4D3C]/25 scale-[1.02]'
                      : 'text-[#41554C] hover:text-[#0B4D3C] hover:bg-[#EBF7F0]/80'
                  }`
                }
                title={collapsed ? item.name : undefined}
              >
                <item.icon
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    collapsed ? 'mx-auto' : 'mr-3'
                  }`}
                />
                {(!collapsed || mobileOpen) && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Collapse Footer Toggle & Status */}
        <div className="p-3.5 border-t border-[#E2EEE7]/80 bg-white/50 backdrop-blur-md flex items-center justify-between shrink-0">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <div className="text-[11px] font-bold text-[#14231E]">
                AYUVISTA v1.0
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-full hover:bg-[#E2EEE7] text-[#41554C] hover:text-[#0B4D3C] transition-all mx-auto active:scale-95 hidden md:flex items-center justify-center"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};
