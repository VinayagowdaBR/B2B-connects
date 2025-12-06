import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    headerActions?: React.ReactNode;
}

const AdminLayout = ({ children, title, subtitle, headerActions }: AdminLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
            <AdminSidebar />

            <main className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Top Bar */}
                {(title || subtitle || headerActions) && (
                    <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-4 sm:px-6 py-4 sticky top-0 z-10 shadow-sm">
                        <div className="flex items-center justify-between pl-12 lg:pl-0">
                            <div>
                                {title && (
                                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                        {title}
                                    </h1>
                                )}
                                {subtitle && (
                                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{subtitle}</p>
                                )}
                            </div>
                            {headerActions && (
                                <div className="hidden sm:flex items-center space-x-4">
                                    {headerActions}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-4 sm:p-6 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
