import { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import CareerModal from '@/components/customer/modals/CareerModal';
import { customerCareersApi } from '@/api/endpoints/customer/careers';
import { Briefcase, Plus, Search, Edit, Trash2, MapPin, Clock, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const CustomerCareers = () => {
    const [careers, setCareers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCareer, setSelectedCareer] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => { fetchCareers(); }, []);

    const fetchCareers = async () => {
        try { setIsLoading(true); const data = await customerCareersApi.getMyCareers(); setCareers(data || []); } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };

    const handleSubmit = async (data) => {
        try {
            if (selectedCareer) { await customerCareersApi.updateCareer(selectedCareer.id, data); toast.success('Updated!'); }
            else { await customerCareersApi.createCareer(data); toast.success('Created!'); }
            setIsModalOpen(false); fetchCareers();
        } catch (e) { toast.error('Failed'); throw e; }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this job posting?')) return;
        try { await customerCareersApi.deleteCareer(id); toast.success('Deleted!'); fetchCareers(); } catch (e) { toast.error('Failed'); }
    };

    const filtered = careers.filter((c) => c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || c.department?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <CustomerLayout title="Career Openings" subtitle="Manage job postings">
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search jobs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm" />
                    </div>
                    <button onClick={() => { setSelectedCareer(null); setIsModalOpen(true); }} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg text-sm">
                        <Plus className="w-4 h-4 mr-2" />Post Job
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No job postings</h3>
                    <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg"><Plus className="w-4 h-4 inline mr-2" />Post Job</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((career) => (
                        <div key={career.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">{career.title || 'Job Title'}</h3>
                                    <p className="text-sm text-teal-600 font-medium">{career.department || 'Department'}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${career.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {career.is_active ? 'Active' : 'Closed'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">{career.description || 'No description'}</p>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                                {career.location && <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{career.location}</span>}
                                {career.employment_type && <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{career.employment_type}</span>}
                                {career.salary_range && <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1" />{career.salary_range}</span>}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t">
                                <span className="text-xs text-gray-400">{career.created_at ? format(new Date(career.created_at), 'MMM dd, yyyy') : ''}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => { setSelectedCareer(career); setIsModalOpen(true); }} className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(career.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CareerModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedCareer(null); }} onSubmit={handleSubmit} career={selectedCareer} />
        </CustomerLayout>
    );
};

export default CustomerCareers;
