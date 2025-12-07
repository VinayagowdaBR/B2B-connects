import { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import TeamMemberModal from '@/components/customer/modals/TeamMemberModal';
import { customerTeamMembersApi } from '@/api/endpoints/customer/teamMembers';
import { UserCheck, Plus, Search, Edit, Trash2, Linkedin, Twitter, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomerTeamMembers = () => {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => { fetchMembers(); }, []);

    const fetchMembers = async () => {
        try {
            setIsLoading(true);
            const data = await customerTeamMembersApi.getMyTeamMembers();
            // Map backend fields to frontend
            const mapped = (data || []).map(m => ({
                ...m,
                is_active: m.publish_to_portfolio ?? true, // "Show on portfolio" checkbox
            }));
            setMembers(mapped);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data) => {
        try {
            // Map frontend to backend & sanitize
            const payload = {
                ...data,
                email: data.email || null, // Fix validate_email error if empty
                phone: data.phone || null,
                linkedin_url: data.linkedin_url || null,
                twitter_url: data.twitter_url || null,
                image_url: data.image_url || null,
                bio: data.bio || null,
                publish_to_portfolio: data.is_active,
                is_active: true // Default to true for the separate backend flag if needed
            };

            if (selectedMember) {
                await customerTeamMembersApi.updateTeamMember(selectedMember.id, payload);
                toast.success('Updated!');
            } else {
                await customerTeamMembersApi.createTeamMember(payload);
                toast.success('Added!');
            }
            setIsModalOpen(false);
            fetchMembers();
        } catch (e) {
            console.error(e);
            toast.error('Failed');
            // throw e; 
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this team member?')) return;
        try { await customerTeamMembersApi.deleteTeamMember(id); toast.success('Removed!'); fetchMembers(); } catch (e) { toast.error('Failed'); }
    };

    const filtered = members.filter((m) => m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || m.position?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <CustomerLayout title="Team Members" subtitle="Manage your team">
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search team members..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm" />
                    </div>
                    <button onClick={() => { setSelectedMember(null); setIsModalOpen(true); }} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg text-sm">
                        <Plus className="w-4 h-4 mr-2" />Add Member
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                    <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No team members</h3>
                    <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg"><Plus className="w-4 h-4 inline mr-2" />Add</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((m) => (
                        <div key={m.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-shadow text-center group">
                            <div className="relative inline-block mb-4">
                                {m.image_url ? (
                                    <img src={m.image_url} alt={m.name} className="w-20 h-20 rounded-full object-cover mx-auto" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto">
                                        {m.name?.charAt(0) || 'T'}
                                    </div>
                                )}
                            </div>
                            <h3 className="font-semibold text-gray-900">{m.name || 'Team Member'}</h3>
                            <p className="text-sm text-teal-600 font-medium">{m.position || 'Position'}</p>
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{m.bio || ''}</p>

                            <div className="flex justify-center gap-2 mt-4">
                                {m.email && <a href={`mailto:${m.email}`} className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full"><Mail className="w-4 h-4" /></a>}
                                {m.linkedin_url && <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"><Linkedin className="w-4 h-4" /></a>}
                                {m.twitter_url && <a href={m.twitter_url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-full"><Twitter className="w-4 h-4" /></a>}
                            </div>

                            <div className="flex justify-center gap-2 mt-4 pt-4 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setSelectedMember(m); setIsModalOpen(true); }} className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(m.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <TeamMemberModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedMember(null); }} onSubmit={handleSubmit} member={selectedMember} />
        </CustomerLayout>
    );
};

export default CustomerTeamMembers;
