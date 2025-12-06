import CustomerSidebar from './CustomerSidebar';

const CustomerLayout = ({ children, title, subtitle }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <CustomerSidebar />

            <main className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Top Bar */}
                {(title || subtitle) && (
                    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
                        <div className="flex items-center justify-between">
                            <div className="ml-12 lg:ml-0">
                                {title && <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>}
                                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-4 sm:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default CustomerLayout;
