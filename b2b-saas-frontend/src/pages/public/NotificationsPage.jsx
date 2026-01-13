import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, Check, Trash2, Clock, MessageCircle,
    AlertCircle, CheckCircle, Info, Filter
} from 'lucide-react';
import { Navbar, Footer } from '@/components/landing';
import { notificationsApi } from '@/api/endpoints/notifications';
import { AuthContext } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all'); // all, unread
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (isAuthenticated) {
                try {
                    const data = await notificationsApi.getAll();
                    setNotifications(data);
                } catch (error) {
                    console.error("Failed to fetch notifications", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [isAuthenticated]);

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'message': return <MessageCircle className="w-5 h-5 text-blue-500" />;
            case 'info':
            default: return <Info className="w-5 h-5 text-indigo-500" />;
        }
    };

    const markAsRead = async (id) => {
        try {
            await notificationsApi.markRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    const markAllRead = async () => {
        try {
            await notificationsApi.markAllRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error("Failed to mark all read", error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await notificationsApi.delete(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => !n.is_read);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 text-center pt-40">
                <Navbar />
                <h2 className="text-2xl font-bold">Please login to view notifications</h2>
                <Link to="/login" className="text-indigo-600 hover:underline mt-4 block">Login here</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="pt-40 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Bell className="w-8 h-8 text-indigo-600 fill-current" />
                                Activity & Notifications
                            </h1>
                            <p className="text-gray-600 mt-2">
                                You have <span className="font-semibold text-indigo-600">{unreadCount} unread</span> notifications
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={markAllRead}
                                disabled={unreadCount === 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${unreadCount > 0
                                        ? 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50 shadow-sm'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <Check className="w-4 h-4" />
                                Mark all read
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            All Notifications
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'unread'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Unread Only
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {filteredNotifications.length > 0 ? (
                                filteredNotifications.map((notification) => (
                                    <motion.div
                                        key={notification.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        className={`group relative bg-white rounded-2xl p-5 border transition-all hover:shadow-md ${!notification.is_read
                                                ? 'border-indigo-100 bg-indigo-50/30'
                                                : 'border-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`flex-shrink-0 p-3 rounded-full ${!notification.is_read ? 'bg-white shadow-sm' : 'bg-gray-50'
                                                }`}>
                                                {getIcon(notification.type)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className={`text-base font-semibold ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'
                                                        }`}>
                                                        {notification.title}
                                                    </h3>
                                                    <span className="text-xs text-gray-500 flex-shrink-0 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(notification.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                                    {notification.message}
                                                </p>

                                                <div className="flex items-center gap-4">
                                                    {!notification.is_read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="text-xs font-medium text-gray-400 hover:text-red-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {!notification.is_read && (
                                                <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-indigo-600 rounded-full shadow-sm ring-4 ring-indigo-50" />
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-24 bg-white rounded-3xl border border-gray-100 border-dashed"
                                >
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Bell className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No notifications found</h3>
                                    <p className="text-gray-500 mt-1">
                                        {filter === 'unread'
                                            ? "You're all caught up! No unread notifications."
                                            : "You don't have any notifications yet."}
                                    </p>
                                    {filter === 'unread' && (
                                        <button
                                            onClick={() => setFilter('all')}
                                            className="mt-4 text-indigo-600 font-medium text-sm hover:underline"
                                        >
                                            View all notifications
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default NotificationsPage;
