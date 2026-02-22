import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, User, Shield, Trash2, Plus, Edit2 } from 'lucide-react';
import type { Role } from '../types';

interface MemberManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MemberManagerModal: React.FC<MemberManagerModalProps> = ({ isOpen, onClose }) => {
    const { users, currentUser, addUser, updateUser, deleteUser } = useStore();
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        role: 'member' as Role
    });

    const [editingId, setEditingId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateUser(editingId, formData);
            setEditingId(null);
        } else {
            if (users.some(u => u.username === formData.username)) {
                alert('Tên đăng nhập đã tồn tại');
                return;
            }
            addUser(formData);
        }
        resetForm();
        setIsAdding(false);
    };

    const resetForm = () => {
        setFormData({
            username: '',
            password: '',
            fullName: '',
            role: 'member'
        });
        setEditingId(null);
    };

    const startEdit = (user: any) => {
        setFormData({
            username: user.username,
            password: user.password || '',
            fullName: user.fullName,
            role: user.role
        });
        setEditingId(user.id);
        setIsAdding(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa thành viên này không?')) {
            deleteUser(id);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Quản Lý Thành Viên</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {isAdding ? (
                        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <h3 className="font-semibold text-slate-800 mb-4">{editingId ? 'Chỉnh Sửa Thành Viên' : 'Thêm Thành Viên Mới'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tên đăng nhập</label>
                                    <input
                                        type="text"
                                        required
                                        className="input"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                                    <input
                                        type="text"
                                        required={!editingId}
                                        placeholder={editingId ? "Để trống nếu không đổi" : ""}
                                        className="input"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Họ và Tên</label>
                                    <input
                                        type="text"
                                        required
                                        className="input"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Vai Trò</label>
                                    <select
                                        className="input"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                                    >
                                        <option value="member">Thành viên (Chỉ xem)</option>
                                        <option value="admin">Quản trị viên (Toàn quyền)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAdding(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="btn bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    {editingId ? 'Cập Nhật' : 'Thêm Mới'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all mb-6 flex items-center justify-center font-medium"
                        >
                            <Plus size={20} className="mr-2" />
                            Thêm Thành Viên Mới
                        </button>
                    )}

                    <div className="space-y-3">
                        {users.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                                        {user.role === 'admin' ? <Shield size={20} /> : <User size={20} />}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800 flex items-center gap-2">
                                            {user.fullName}
                                            {user.id === currentUser?.id && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Bạn</span>}
                                        </div>
                                        <div className="text-sm text-slate-500">@{user.username} • <span className="capitalize">{user.role}</span></div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(user)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Sửa"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    {user.id !== currentUser?.id && (
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Xóa"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
