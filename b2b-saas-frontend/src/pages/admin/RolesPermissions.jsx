import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { rolesApi } from '@/api/endpoints/roles';
import { Shield, Plus, Trash2, Tag, CheckCircle } from 'lucide-react';

const RolesPermissions = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newRoleName, setNewRoleName] = useState('');
  const [newPermission, setNewPermission] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [rolesData, permissionsData] = await Promise.all([
        rolesApi.getRoles(),
        rolesApi.getPermissions(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    try {
      await rolesApi.createRole({ name: newRoleName });
      toast.success('Role created successfully!');
      setNewRoleName('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create role');
    }
  };

  const handleCreatePermission = async (e) => {
    e.preventDefault();
    if (!newPermission.name.trim()) return;

    try {
      await rolesApi.createPermission(newPermission);
      toast.success('Permission created successfully!');
      setNewPermission({ name: '', description: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create permission');
    }
  };

  const handleAssignPermission = async (roleId, permissionName) => {
    try {
      await rolesApi.assignPermission(roleId, permissionName);
      toast.success('Permission assigned!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to assign permission');
    }
  };

  const handleRemovePermission = async (roleId, permissionName) => {
    try {
      await rolesApi.removePermission(roleId, permissionName);
      toast.success('Permission removed!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to remove permission');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
            <p className="text-sm text-gray-500">Manage access control</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Create Role */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-indigo-600" />
              Create New Role
            </h2>
            <form onSubmit={handleCreateRole} className="flex space-x-3">
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Role name (e.g., editor, viewer)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Role</span>
              </button>
            </form>
          </div>

          {/* Create Permission */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-purple-600" />
              Create New Permission
            </h2>
            <form onSubmit={handleCreatePermission} className="space-y-3">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newPermission.name}
                  onChange={(e) => setNewPermission({ ...newPermission, name: e.target.value })}
                  placeholder="Permission name (e.g., users:create)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={newPermission.description}
                  onChange={(e) =>
                    setNewPermission({ ...newPermission, description: e.target.value })
                  }
                  placeholder="Description (optional)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create</span>
                </button>
              </div>
            </form>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                    {role.name}
                  </h3>
                  <span className="text-sm text-gray-500">ID: {role.id}</span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Assigned Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions?.length > 0 ? (
                      role.permissions.map((perm) => (
                        <span
                          key={perm.id}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>{perm.name}</span>
                          <button
                            onClick={() => handleRemovePermission(role.id, perm.name)}
                            className="ml-1 text-indigo-500 hover:text-indigo-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No permissions assigned</span>
                    )}
                  </div>
                </div>

                {/* Assign Permission Dropdown */}
                <div className="mt-4">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAssignPermission(role.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">+ Assign Permission</option>
                    {permissions
                      .filter(
                        (perm) => !role.permissions?.some((rp) => rp.name === perm.name)
                      )
                      .map((perm) => (
                        <option key={perm.id} value={perm.name}>
                          {perm.name} {perm.description && `- ${perm.description}`}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* All Permissions List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Permissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {permissions.map((perm) => (
                <div key={perm.id} className="p-3 border border-gray-200 rounded-lg">
                  <p className="font-medium text-gray-900">{perm.name}</p>
                  {perm.description && (
                    <p className="text-sm text-gray-500 mt-1">{perm.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RolesPermissions;
