import { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { customerInquiriesApi } from '@/api/endpoints/customer/inquiries';
import { Mail, Search, Eye, Trash2, Clock, User, MessageSquare, Check, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const CustomerInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    useEffect(() => { fetchInquiries(); }, []);

    const fetchInquiries = async () => {
        try { setIsLoading(true); const data = await customerInquiriesApi.getMyInquiries(); setInquiries(data || []); } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };

    const handleMarkAsRead = async (inquiry) => {
        try {
            await customerInquiriesApi.updateInquiry(inquiry.id, { ...inquiry, status: 'read' });
            toast.success('Marked as read');
            fetchInquiries();
        } catch (e) { toast.error('Failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this inquiry?')) return;
        try { await customerInquiriesApi.deleteInquiry(id); toast.success('Deleted!'); fetchInquiries(); setSelectedInquiry(null); } catch (e) { toast.error('Failed'); }
    };

    const filtered = inquiries.filter((i) => {
        const matchesSearch = i.name?.toLowerCase().includes(searchQuery.toLowerCase()) || i.email?.toLowerCase().includes(searchQuery.toLowerCase()) || i.message?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || i.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: inquiries.length,
        unread: inquiries.filter((i) => i.status === 'unread' || !i.status).length,
        read: inquiries.filter((i) => i.status === 'read').length,
    };

    return (
        <CustomerLayout title="Inquiries" subtitle="Messages from your portfolio visitors">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold text-gray-900">{stats.total}</p></div>
                        <Mail className="w-10 h-10 p-2 rounded-lg bg-blue-100 text-blue-600" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div><p className="text-sm text-gray-500">Unread</p><p className="text-2xl font-bold text-orange-600">{stats.unread}</p></div>
                        <MessageSquare className="w-10 h-10 p-2 rounded-lg bg-orange-100 text-orange-600" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div><p className="text-sm text-gray-500">Read</p><p className="text-2xl font-bold text-green-600">{stats.read}</p></div>
                        <Check className="w-10 h-10 p-2 rounded-lg bg-green-100 text-green-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search inquiries..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm" />
                    </div>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
                        <option value="all">All Status</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inquiries List */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="p-4 border-b bg-gray-50">
                        <h3 className="font-medium text-gray-900">Messages ({filtered.length})</h3>
                    </div>
                    <div className="divide-y max-h-[600px] overflow-y-auto">
                        {isLoading ? (
                            <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div></div>
                        ) : filtered.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Mail className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No inquiries</p>
                            </div>
                        ) : (
                            filtered.map((inquiry) => (
                                <button
                                    key={inquiry.id}
                                    onClick={() => setSelectedInquiry(inquiry)}
                                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selectedInquiry?.id === inquiry.id ? 'bg-teal-50 border-l-4 border-teal-500' : ''}`}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <p className={`font-medium text-gray-900 truncate ${inquiry.status !== 'read' ? 'font-bold' : ''}`}>{inquiry.name || 'Anonymous'}</p>
                                        {inquiry.status !== 'read' && <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-2"></span>}
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{inquiry.subject || inquiry.message?.substring(0, 50) || 'No subject'}</p>
                                    <p className="text-xs text-gray-400 mt-1">{inquiry.created_at ? format(new Date(inquiry.created_at), 'MMM dd, HH:mm') : ''}</p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Inquiry Detail */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden">
                    {selectedInquiry ? (
                        <>
                            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{selectedInquiry.subject || 'No Subject'}</h3>
                                    <p className="text-sm text-gray-500">From: {selectedInquiry.name}</p>
                                </div>
                                <div className="flex gap-2">
                                    {selectedInquiry.status !== 'read' && (
                                        <button onClick={() => handleMarkAsRead(selectedInquiry)} className="px-3 py-1.5 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200">
                                            <Check className="w-4 h-4 inline mr-1" />Mark Read
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(selectedInquiry.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
                                    <span className="flex items-center"><User className="w-4 h-4 mr-1" />{selectedInquiry.name || 'N/A'}</span>
                                    <span className="flex items-center"><Mail className="w-4 h-4 mr-1" />{selectedInquiry.email || 'N/A'}</span>
                                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{selectedInquiry.created_at ? format(new Date(selectedInquiry.created_at), 'MMM dd, yyyy HH:mm') : 'N/A'}</span>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 min-h-[200px]">
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message || 'No message content'}</p>
                                </div>
                                {selectedInquiry.email && (
                                    <div className="mt-6">
                                        <a
                                            href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject || 'Your Inquiry'}`}
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600"
                                        >
                                            <Mail className="w-4 h-4 mr-2" />Reply via Email
                                        </a>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="p-12 text-center text-gray-500 h-full flex flex-col items-center justify-center">
                            <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                            <p>Select an inquiry to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
};

export default CustomerInquiries;
