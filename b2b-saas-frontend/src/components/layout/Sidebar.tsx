import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const adminLinks = [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/users', label: 'Users' },
        { path: '/admin/companies', label: 'Companies' },
    ];

    const customerLinks = [
        { path: '/customer/dashboard', label: 'Dashboard' },
        { path: '/customer/profile', label: 'Profile' },
    ];

    const links = user?.role === 'admin' ? adminLinks : customerLinks;

    return (
        <aside className="w-64 bg-gray-800 text-white min-h-screen">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-6">
                    {user?.role === 'admin' ? 'Admin Panel' : 'Customer Portal'}
                </h2>
                <nav>
                    <ul className="space-y-2">
                        {links.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`block px-4 py-2 rounded transition-colors ${isActive(link.path)
                                            ? 'bg-blue-600'
                                            : 'hover:bg-gray-700'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
