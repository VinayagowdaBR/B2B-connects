import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Settings,
  ChevronLeft,
  LogOut,
  Shield,
  MapPin,
  UserCog,
  Tag,
  Menu,
  X,
  ShoppingBag,
  FolderOpen,
  MessageCircle,
  UserCheck,
  Newspaper,
  Briefcase,
  Images,
  Mail,
  Zap,
  Globe,
} from 'lucide-react';

interface MenuItem {
  name: string;
  icon: any;
  path: string;
  badge?: string;
  category?: string;
}

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems: MenuItem[] = [
    // Core Admin
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', category: 'Core' },
    { name: 'User Management', icon: Users, path: '/admin/users', category: 'Core' },
    { name: 'Pending Approvals', icon: UserCheck, path: '/admin/approvals', category: 'Core' },
    { name: 'Customers', icon: Building2, path: '/admin/customers', category: 'Core' },
    { name: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptions', category: 'Core' },

    // System Management
    { name: 'Roles & Permissions', icon: Shield, path: '/admin/roles', category: 'System' },
    { name: 'States & Districts', icon: MapPin, path: '/admin/locations', category: 'System' },
    { name: 'Customer Types', icon: UserCog, path: '/admin/customer-types', category: 'System' },
    { name: 'Categories', icon: FolderOpen, path: '/admin/categories', category: 'System' },

    // Company Content
    { name: 'Company Info', icon: Building2, path: '/admin/companies', category: 'Content' },
    { name: 'Services', icon: Tag, path: '/admin/services', category: 'Content' },
    { name: 'Products', icon: ShoppingBag, path: '/admin/products', category: 'Content' },
    { name: 'Projects', icon: FolderOpen, path: '/admin/projects', category: 'Content' },
    { name: 'Testimonials', icon: MessageCircle, path: '/admin/testimonials', category: 'Content' },
    { name: 'Team Members', icon: UserCheck, path: '/admin/team-members', category: 'Content' },
    { name: 'Blog Posts', icon: Newspaper, path: '/admin/blog-posts', category: 'Content' },
    { name: 'Careers', icon: Briefcase, path: '/admin/careers', category: 'Content' },

    // Communication
    { name: 'Inquiries', icon: Mail, path: '/admin/inquiries', category: 'Communication' },
    { name: 'Gallery', icon: Images, path: '/admin/gallery', category: 'Content' },

    // Settings
    { name: 'Site Settings', icon: Globe, path: '/admin/site-settings', category: 'System' },
    { name: 'Settings', icon: Settings, path: '/admin/settings', category: 'System' },
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

  const categoryOrder = ['Core', 'System', 'Content', 'Communication'];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <div className="relative w-6 h-6">
          <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isMobileOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
            <Menu className="w-6 h-6 text-indigo-600" />
          </span>
          <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isMobileOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`}>
            <X className="w-6 h-6 text-indigo-600" />
          </span>
        </div>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen 
          bg-gradient-to-b from-indigo-950 via-purple-950 to-violet-950
          text-white z-40 shadow-2xl flex flex-col
          transition-all duration-300 ease-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>

        {/* Header - Fixed at top */}
        <div className="relative flex-shrink-0 flex items-center justify-between p-4 border-b border-white/10">
          <div className={`flex items-center space-x-3 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="whitespace-nowrap">
              <h1 className="font-bold text-lg tracking-tight">Admin Panel</h1>
              <p className="text-xs text-white/50">B2B SaaS Platform</p>
            </div>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
          >
            <div className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}>
              <ChevronLeft className="w-5 h-5 text-white/70 group-hover:text-white" />
            </div>
          </button>
        </div>

        {/* User Info - Fixed below header */}
        <div className="relative flex-shrink-0 p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold text-base shadow-lg shadow-pink-500/30">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-indigo-950"></div>
            </div>
            <div className={`flex-1 min-w-0 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <p className="font-semibold text-sm truncate">{user?.full_name || 'Admin'}</p>
              <p className="text-xs text-white/50 truncate">{user?.email || 'admin@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Menu Items - Scrollable area */}
        <nav className="relative flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4 scrollbar-thin">
          {categoryOrder.map((category, categoryIndex) => {
            const items = groupedMenuItems[category];
            if (!items || items.length === 0) return null;

            return (
              <div key={category} className="space-y-1">
                {!isCollapsed && (
                  <div
                    className="px-3 mb-2 animate-fade-in"
                    style={{ animationDelay: `${categoryIndex * 0.05}s` }}
                  >
                    <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                      {category}
                    </p>
                  </div>
                )}
                <div className="space-y-0.5">
                  {items.map((item, itemIndex) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`
                        sidebar-item flex items-center space-x-3 px-3 py-2.5 rounded-xl
                        ${isActive(item.path)
                          ? 'bg-white/15 text-white shadow-lg shadow-white/5'
                          : 'text-white/60 hover:bg-white/10 hover:text-white'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      title={isCollapsed ? item.name : ''}
                      style={mounted ? { animationDelay: `${(categoryIndex * items.length + itemIndex) * 0.02}s` } : {}}
                    >
                      <item.icon className={`sidebar-icon w-5 h-5 flex-shrink-0 ${isActive(item.path) ? 'text-white' : ''}`} />
                      {!isCollapsed && (
                        <span className="flex-1 text-sm font-medium truncate">{item.name}</span>
                      )}
                      {!isCollapsed && item.badge && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-500 text-white font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="relative flex-shrink-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center space-x-3 px-3 py-3 rounded-xl
              text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 group
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMobileOpen(false)}
      />
    </>
  );
};

export default AdminSidebar;
