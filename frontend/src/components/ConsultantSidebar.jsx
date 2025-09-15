import { Calendar, Users, UserCheck, Video, Share2, FileText, Mail, AlertTriangle, Home, LogOut, User, LayoutDashboard, Stethoscope, Heart, ArrowLeftRight, CreditCard, MessageCircle, UserPlus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  useSidebar 
} from "@/components/ui/sidebar";
import { canAccessRoute, isClinic, isDoctor, getCurrentUser } from "@/utils/roleUtils";

const allNavigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, routeName: "dashboard" },
  { title: "Patient Management", url: "/patients", icon: Users, routeName: "patient-management" },
  { title: "Doctors Management", url: "/doctors", icon: UserCheck, routeName: "doctors-management" },
  { title: "Nurses Management", url: "/nurses", icon: UserPlus, routeName: "nurses-management" },
  { title: "Teleconsultation", url: "/teleconsultation", icon: Video, routeName: "teleconsultation" },
  { title: "Referral System", url: "/referrals", icon: Share2, routeName: "referral-system" },
  { title: "Community Hub", url: "/community", icon: MessageCircle, routeName: "community-hub" },
  { title: "Invoice Management", url: "/invoices", icon: FileText, routeName: "invoice-management" },
  { title: "Compliance Alerts", url: "/compliance", icon: AlertTriangle, routeName: "compliance-alerts" },
];

export function ConsultantSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const authUser = getCurrentUser();
  
  // Filter navigation items based on user role
  const navigationItems = allNavigationItems.filter(item => 
    canAccessRoute(item.routeName)
  );

  const isActive = (path) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path) => {
    const baseClasses = collapsed 
      ? "w-full justify-center transition-all duration-300 ease-in-out rounded-xl mx-1 px-2 py-3 font-medium relative overflow-hidden group"
      : "w-full justify-start transition-all duration-300 ease-in-out rounded-xl mx-2 px-4 py-3 font-medium relative overflow-hidden group";
    const activeClasses = isActive(path) 
      ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/20 transform scale-[1.02] dark:from-teal-500 dark:to-cyan-500 dark:shadow-teal-400/20" 
      : "hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 hover:text-teal-800 hover:shadow-md hover:shadow-teal-200/50 border border-transparent hover:border-teal-200/50 hover:transform hover:scale-[1.01] dark:hover:from-teal-900/30 dark:hover:to-cyan-900/30 dark:hover:text-teal-200 dark:hover:shadow-teal-700/30 dark:hover:border-teal-700/30";
    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <Sidebar className={`border-r border-teal-200/50 bg-gradient-to-b from-white via-teal-50/20 to-cyan-50/30 dark:border-teal-700/30 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900/80 transition-all duration-300 ease-in-out shadow-xl backdrop-blur-sm h-screen sticky top-0 flex-shrink-0`} style={{ minHeight: '100vh', width: collapsed ? '4rem' : '16rem' }}>
      <SidebarContent className="h-full flex flex-col overflow-hidden" style={{ minHeight: '100vh' }}>
        {/* Header */}
        <div className="p-6 border-b border-teal-200/50 bg-gradient-to-r from-teal-50 via-cyan-50/50 to-teal-100/30 dark:border-teal-700/30 dark:from-slate-800/50 dark:via-slate-700/30 dark:to-slate-800/80 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-100/20 to-cyan-100/20 opacity-50 dark:from-teal-900/20 dark:to-cyan-900/20"></div>
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-700 dark:from-teal-500 dark:via-cyan-500 dark:to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/25 dark:shadow-teal-400/20 transform hover:scale-105 transition-transform duration-200">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-teal-900 dark:text-teal-100 text-lg tracking-tight">Smaart Healthcare</h2>
                <p className="text-sm text-teal-700 dark:text-teal-300 font-medium">Healthcare Platform</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup className="flex-1 px-3 py-6 min-h-0 overflow-y-auto">
          <SidebarGroupLabel className={`text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-4 px-2 ${collapsed ? "sr-only" : ""}`}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex-1">
            <SidebarMenu className="space-y-2 pb-4">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className={`w-5 h-5 transition-all duration-200 ${isActive(item.url) ? 'scale-110 text-white' : 'text-teal-600 dark:text-teal-400 group-hover:text-teal-800 dark:group-hover:text-teal-200 group-hover:scale-105'}`} />
                      {!collapsed && (
                        <span className="ml-3 transition-all duration-200">
                          {item.title}
                        </span>
                      )}
                      {/* Active indicator */}
                      {isActive(item.url) && (
                        <div className="absolute right-2 w-2 h-2 bg-white dark:bg-teal-100 rounded-full shadow-sm"></div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer - hide on auth pages, show logged-in user */}
        {!collapsed && !['/login','/register'].includes(currentPath) && authUser && (
          <div className={`p-6 border-t relative overflow-hidden mt-auto ${
            isClinic() 
              ? "border-purple-200/50 bg-gradient-to-r from-purple-50 via-indigo-50/30 to-purple-100/50 dark:border-purple-700/30 dark:from-slate-800/50 dark:via-slate-700/30 dark:to-slate-800/80"
              : "border-teal-200/50 bg-gradient-to-r from-teal-50 via-cyan-50/30 to-teal-100/50 dark:border-teal-700/30 dark:from-slate-800/50 dark:via-slate-700/30 dark:to-slate-800/80"
          }`}>
            <div className={`absolute inset-0 opacity-50 ${
              isClinic()
                ? "bg-gradient-to-r from-purple-100/20 to-indigo-100/20 dark:from-purple-900/20 dark:to-indigo-900/20"
                : "bg-gradient-to-r from-teal-100/20 to-cyan-100/20 dark:from-teal-900/20 dark:to-cyan-900/20"
            }`}></div>
            <div className="relative text-sm">
              <p className={`font-semibold ${
                isClinic() 
                  ? "text-purple-900 dark:text-purple-100" 
                  : "text-teal-900 dark:text-teal-100"
              }`}>
                {authUser.name || authUser.fullName || 'User'}
              </p>
              <p className={`${
                isClinic() 
                  ? "text-purple-700 dark:text-purple-300" 
                  : "text-teal-700 dark:text-teal-300"
              }`}>
                {isClinic() ? 'Clinic Admin' : (authUser.specialty || 'Doctor')}
              </p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
