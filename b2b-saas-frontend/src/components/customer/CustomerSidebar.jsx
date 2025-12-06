import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  User,
  CreditCard,
  Building2,
  Package,
  ShoppingBag,
  FolderOpen,
  MessageCircle,
  UserCheck,
  Newspaper,
  Briefcase,
  Mail,
  Images,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Globe,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

interface MenuItem {
  name: string;
  icon: any;
  path: string;
  badge?: string;
  category?: string;
}

const CustomerSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems: MenuItem[] = [
    // Core
    { name: 'Dashboard', icon: LayoutDashboard, path: '/customer/dashboard', category: 'Core' },
    { name: 'My Profile', icon: User, path: '/customer/profile', category: 'Core' },
    { name: 'Subscription', icon: CreditCard, path: '/customer/subscription', category: 'Core' },
    
    // Company
    { name: 'Company Info', icon: Building2, path: '/customer/company-info', category: 'Company' },
    
    // Content Management
    { name: 'Services', icon: Package, path: '/customer/services', category: 'Content' },
    { name: 'Products', icon: ShoppingBag, path: '/customer/products', category: 'Content' },
    { name: 'Projects', icon: FolderOpen, path: '/customer/projects', category: 'Content' },
    { name: 'Testimonials', icon: MessageCircle, path: '/customer/testimonials', category: 'Content' },
    { name: 'Team Members', icon: UserCheck, path: '/customer/team-members', category: 'Content' },
    { name: 'Blog Posts', icon: Newspaper, path: '/customer/blog-posts', category: 'Content' },
    { name: 'Careers', icon: Briefcase, path: '/customer/careers', category: 'Content' },
    { name: 'Gallery', icon: Images, path: '/customer/gallery', category: 'Content' },
    
    // Communication
    { name: 'Inquiries', icon: Mail, path: '/customer/inquiries', category: 'Communication' },
    
    // Settings
    { name: 'Settings', icon: Settings, path: '/customer/settings', category: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Group menu items by category
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const categoryOrder = ['Core', 'Company', 'Content', 'Communication', 'Settings'];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-gradient-to-b from-teal-600 via-cyan-600 to-blue-600 
          text-white transition-all duration-300 z-40 shadow-2xl flex flex-col
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/10">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">My Portal</h1>
                <p className="text-xs text-white/60">Customer Dashboard</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* User Info - Fixed below header */}
        <div className="flex-shrink-0 p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'C'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user?.full_name || 'Customer'}</p>
                <p className="text-xs text-white/60 truncate">{user?.email || 'customer@example.com'}</p>
              </div>
            )}
          </div>
        </div>

        {/* View Public Portfolio Button */}
        {!isCollapsed && (
          <div className="flex-shrink-0 p-4 border-b border-white/10">
            <a
              href={`/portfolio/${user?.tenant_id || 'demo'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">View My Portfolio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Menu Items - Scrollable area */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
          {categoryOrder.map((category) => {
            const items = groupedMenuItems[category];
            if (!items || items.length === 0) return null;

            return (
              <div key={category}>
                {!isCollapsed && (
                  <div className="px-3 mb-2">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                      {category}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  {items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`
                        flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all
                        ${isActive(item.path)
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      title={isCollapsed ? item.name : ''}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-sm font-medium">{item.name}</span>
                          {item.badge && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center space-x-3 px-3 py-3 rounded-lg
              text-white/70 hover:bg-red-500/20 hover:text-white transition-all
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default CustomerSidebar;
