import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Bell,
  Shield,
  UserCheck,
  ChevronDown,
  Check,
  Sparkles,
  Search,
  User as UserIcon,
  Building,
  Mail,
  LogOut,
  ExternalLink,
  Activity,
  Award,
  Menu,
  Clock,
} from 'lucide-react';
import { apiRequest } from '../../api/client';
import gsap from 'gsap';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { user, role, switchRole, logout } = useAuth();
  const [timeStr, setTimeStr] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Global search input & instant dropdown states
  const [globalQuery, setGlobalQuery] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [allStudies, setAllStudies] = useState<any[]>([]);
  const navigate = useNavigate();

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifyMenuRef = useRef<HTMLDivElement>(null);
  const searchMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    apiRequest<any[]>('/tasks/notifications')
      .then(setNotifications)
      .catch(() => {});
    apiRequest<any[]>('/studies')
      .then(setAllStudies)
      .catch(() => {});
  }, []);

  // Animate dropdowns when toggled using GSAP
  useEffect(() => {
    if (showRoleMenu && roleMenuRef.current) {
      gsap.fromTo(
        roleMenuRef.current,
        { opacity: 0, y: -8, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' }
      );
    }
  }, [showRoleMenu]);

  useEffect(() => {
    if (showProfileMenu && profileMenuRef.current) {
      gsap.fromTo(
        profileMenuRef.current,
        { opacity: 0, y: -8, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' }
      );
    }
  }, [showProfileMenu]);

  useEffect(() => {
    if (showNotifications && notifyMenuRef.current) {
      gsap.fromTo(
        notifyMenuRef.current,
        { opacity: 0, y: -8, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' }
      );
    }
  }, [showNotifications]);

  const rolesList: { role: UserRole; title: string; desc: string; badgeColor: string }[] = [
    { role: 'PRINCIPAL_INVESTIGATOR', title: 'Principal Investigator', desc: 'Protocol, risk review & safety', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { role: 'STUDY_COORDINATOR', title: 'Study Coordinator', desc: 'Participant enrollment, visits & queries', badgeColor: 'bg-sky-100 text-sky-800' },
    { role: 'MONITOR', title: 'Clinical Monitor (CRA)', desc: 'Site monitoring visits, deviations & SDV', badgeColor: 'bg-amber-100 text-amber-800' },
    { role: 'ETHICS', title: 'Ethics Committee (IEC)', desc: 'Protocol approvals & continuing reviews', badgeColor: 'bg-purple-100 text-purple-800' },
    { role: 'PHARMACOVIGILANCE', title: 'Pharmacovigilance (PV)', desc: 'AE/SAE expedited clock & signals', badgeColor: 'bg-rose-100 text-rose-800' },
    { role: 'LEADERSHIP', title: 'Institutional Leadership', desc: 'Portfolio governance & executive metrics', badgeColor: 'bg-teal-100 text-teal-800' },
    { role: 'REGULATOR_READ_ONLY', title: 'Regulator / Auditor', desc: 'Read-only compliance & audit trails', badgeColor: 'bg-slate-100 text-slate-800' },
    { role: 'ADMIN', title: 'System Administrator', desc: 'Full administrative governance', badgeColor: 'bg-indigo-100 text-indigo-800' },
  ];

  // Filter search results
  const filteredSearchResults = allStudies.filter(
    (s) =>
      s.study_code.toLowerCase().includes(globalQuery.toLowerCase()) ||
      s.title.toLowerCase().includes(globalQuery.toLowerCase()) ||
      s.therapeutic_area.toLowerCase().includes(globalQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <header className="h-20 bg-white/95 backdrop-blur-xl border-b border-[#E2EEE7] px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 shadow-[0_2px_15px_rgba(0,40,25,0.03)] w-full">
      {/* Brand & Mobile Toggle & Global Search Bar */}
      <div className="flex items-center space-x-3 sm:space-x-6 min-w-0">
        {/* Mobile Hamburger Drawer Button */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2.5 rounded-full hover:bg-[#F4FBF7] text-[#0B4D3C] md:hidden transition active:scale-95 border border-[#D5E6DC]"
          title="Open Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div
          onClick={() => navigate('/')}
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group shrink-0"
        >
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-br from-[#0B4D3C] to-[#043427] text-white flex items-center justify-center font-black text-base sm:text-lg shadow-md shadow-[#0B4D3C]/25 ring-4 ring-[#D1F2E2] transition-transform duration-200 group-hover:scale-105">
            AV
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#0B4D3C]">AYUVISTA</span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-black font-mono rounded-full bg-[#D1F2E2] text-[#043427] border border-[#A7F3D0]">
                NPvCC
              </span>
            </div>
            <p className="text-[11px] text-[#526D61] font-medium -mt-0.5 hidden xl:block">
              Unified Clinical Research &amp; Pharmacovigilance Platform for AYUSH
            </p>
          </div>
        </div>

        {/* Global Live Search Bar with Autocomplete dropdown (Hidden on tiny screens to avoid overlap) */}
        <div className="relative hidden lg:block w-72 xl:w-88">
          <div className="flex items-center bg-[#F4FBF7] border border-[#D5E6DC] rounded-full px-4 py-2 w-full focus-within:ring-2 focus-within:ring-[#0B4D3C] focus-within:bg-white focus-within:border-transparent transition-all shadow-inner">
            <Search className="h-4 w-4 text-[#526D61] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search trials, codes, drugs..."
              value={globalQuery}
              onChange={(e) => {
                setGlobalQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="bg-transparent border-none text-xs text-[#14231E] font-medium placeholder-[#7D9A8D] focus:outline-none w-full"
            />
          </div>

          {/* Autocomplete Search Dropdown */}
          {showSearchResults && globalQuery.trim().length > 0 && (
            <div
              ref={searchMenuRef}
              className="absolute left-0 top-12 w-96 bg-white rounded-3xl border border-[#D5E6DC] shadow-2xl p-3 z-50 animate-in fade-in"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#F0F7F2] px-2 text-[10px] font-bold font-mono text-[#526D61] uppercase tracking-wider">
                <span>Matching Clinical Protocols</span>
                <span>{filteredSearchResults.length} found</span>
              </div>
              <div className="divide-y divide-[#F0F7F2] mt-1 max-h-64 overflow-y-auto">
                {filteredSearchResults.length > 0 ? (
                  filteredSearchResults.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        navigate(`/studies/${s.study_code}`);
                        setShowSearchResults(false);
                        setGlobalQuery('');
                      }}
                      className="p-3 hover:bg-[#F4FBF7] rounded-2xl cursor-pointer transition flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-mono font-bold text-xs text-[#0B4D3C] group-hover:underline">
                          {s.study_code}
                        </div>
                        <div className="text-xs font-semibold text-[#14231E] line-clamp-1">{s.title}</div>
                        <div className="text-[10px] text-[#526D61]">{s.therapeutic_area} • {s.phase}</div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EBF7F0] text-[#0B4D3C]">
                        Risk {s.risk_score?.toFixed(0)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-[#718E81] font-mono">
                    No studies matching "{globalQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Cleaned up spacing with zero overlap */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Time Stamp Badge - Shows cleanly on xl screens, concise time without overlap */}
        <div className="hidden 2xl:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F4FBF7] border border-[#D5E6DC] text-xs font-bold text-[#41554C] shadow-sm shrink-0 whitespace-nowrap">
          <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span className="font-mono">{timeStr}</span>
        </div>

        {/* M3 Role Switcher Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowProfileMenu(false);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 rounded-full bg-[#EBF7F0] hover:bg-[#DDF2E6] border border-[#C5E3D2] text-[#0B4D3C] text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            <Shield className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Role: {role.replace(/_/g, ' ')}</span>
            <span className="sm:hidden font-mono text-[11px]">{role.slice(0, 4)}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-60 shrink-0" />
          </button>

          {showRoleMenu && (
            <div
              ref={roleMenuRef}
              className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-xs sm:w-80 bg-white rounded-3xl border border-[#D5E6DC] shadow-2xl p-3 z-50"
            >
              <div className="px-3 py-2 border-b border-[#E2EEE7] text-[11px] font-bold uppercase tracking-wider text-[#0B4D3C] font-mono flex items-center justify-between">
                <span>Switch Testing Role</span>
                <span className="text-[10px] text-[#526D61] font-sans font-normal">Instant RBAC</span>
              </div>
              <div className="max-h-80 overflow-y-auto py-1 space-y-1 mt-1">
                {rolesList.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchRole(r.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs transition-all flex items-start space-x-2.5 ${
                      role === r.role
                        ? 'bg-[#0B4D3C] text-white shadow-md'
                        : 'hover:bg-[#F4FBF7] text-[#14231E]'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-bold flex items-center space-x-2">
                        <span>{r.title}</span>
                      </div>
                      <div className={`text-[11px] mt-0.5 ${role === r.role ? 'text-[#D1F2E2]' : 'text-[#688578]'}`}>
                        {r.desc}
                      </div>
                    </div>
                    {role === r.role && <Check className="h-4 w-4 mt-0.5 text-white shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Tray */}
        <div className="relative shrink-0">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleMenu(false);
              setShowProfileMenu(false);
            }}
            className="h-10 w-10 rounded-full bg-[#F4FBF7] hover:bg-[#EBF7F0] border border-[#D5E6DC] flex items-center justify-center text-[#41554C] hover:text-[#0B4D3C] transition-all relative active:scale-95 shadow-sm shrink-0"
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div
              ref={notifyMenuRef}
              className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-xs sm:w-88 bg-white rounded-3xl border border-[#D5E6DC] shadow-2xl p-4 z-50"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E2EEE7] px-1">
                <span className="text-xs font-bold text-[#14231E]">Audit & Operational Alerts</span>
                <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  {notifications.length} Active
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#F0F7F2] mt-1">
                {notifications.slice(0, 6).map((n, i) => (
                  <div key={i} className="p-3 text-xs hover:bg-[#F4FBF7] rounded-2xl transition">
                    <div className="font-bold text-[#14231E]">{n.title || n.action}</div>
                    <div className="text-[11px] text-[#526D61] mt-0.5 font-medium">{n.reason || n.details || 'System notice'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative pl-2 border-l border-[#E2EEE7] shrink-0">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowRoleMenu(false);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-[#F4FBF7] transition active:scale-95 group"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#FEF3C7] to-[#FDE68A] border border-amber-300 flex items-center justify-center text-amber-950 font-black text-xs shadow-sm ring-2 ring-transparent group-hover:ring-[#0B4D3C] shrink-0">
              {user?.full_name?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'Dr'}
            </div>
            <div className="hidden lg:block text-left pr-1">
              <div className="text-xs font-bold text-[#14231E] truncate max-w-[110px]">
                {user?.full_name || 'Dr. Olivia'}
              </div>
              <div className="text-[10px] text-[#526D61] truncate max-w-[110px] font-medium">
                {user?.department || 'Kayachikitsa'}
              </div>
            </div>
            <ChevronDown className="h-3 w-3 text-[#526D61] hidden lg:block opacity-70 shrink-0" />
          </button>

          {/* Profile Card Modal Menu */}
          {showProfileMenu && (
            <div
              ref={profileMenuRef}
              className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-xs sm:w-80 bg-white rounded-3xl border border-[#D5E6DC] shadow-2xl p-4 z-50"
            >
              <div className="flex items-center space-x-3 pb-3 border-b border-[#F0F7F2]">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#0B4D3C] to-[#14532D] text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
                  {user?.full_name?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'Dr'}
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-[#14231E] leading-tight truncate">
                    {user?.full_name || 'Dr. Olivia / Prof. Suhas'}
                  </h4>
                  <div className="text-[11px] font-mono text-[#0B4D3C] font-semibold truncate">{user?.email}</div>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF7F0] text-[#0B4D3C] border border-[#D1F2E2]">
                    {user?.role || role}
                  </span>
                </div>
              </div>

              <div className="py-3 space-y-2 text-xs text-[#364F44]">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-[#526D61] shrink-0" />
                  <span className="truncate">{user?.department || 'Department of Kayachikitsa'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-[#526D61] shrink-0" />
                  <span className="truncate">All India Institute of Ayurveda</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-mono text-[11px]">Session: Active (GCP Verified)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0F7F2] flex items-center justify-between">
                <button
                  onClick={() => {
                    navigate('/audit');
                    setShowProfileMenu(false);
                  }}
                  className="text-xs font-bold text-[#0B4D3C] hover:underline"
                >
                  Audit History →
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition flex items-center space-x-1.5"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
