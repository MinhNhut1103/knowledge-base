import React, { useState } from 'react';
import { X, Edit2, Trash2, Check, Plus, AlertCircle } from 'lucide-react';

interface CategoryManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: string[];
    onAdd: (category: string) => void;
    onRename: (oldName: string, newName: string) => void;
    onDelete: (category: string) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
    isOpen,
    onClose,
    categories,
    onAdd,
    onRename,
    onDelete
}) => {
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newCategory.trim();
        if (!trimmed) return;

        if (categories.includes(trimmed)) {
            setError('Danh mục đã tồn tại');
            return;
        }

        onAdd(trimmed);
        setNewCategory('');
        setError(null);
    };

    const startEdit = (category: string) => {
        setEditingCategory(category);
        setEditValue(category);
        setError(null);
    };

    const saveEdit = () => {
        const trimmed = editValue.trim();
        if (!trimmed || trimmed === editingCategory) {
            setEditingCategory(null);
            return;
        }

        if (categories.includes(trimmed)) {
            setError('Danh mục đã tồn tại');
            return;
        }

        if (editingCategory) {
            onRename(editingCategory, trimmed);
        }
        setEditingCategory(null);
        setError(null);
    };

    const handleDelete = (category: string) => {
        if (category === 'General' || categories.length <= 1) {
            setError('Không thể xóa danh mục mặc định hoặc danh mục cuối cùng');
            return;
        }
        if (confirm(`Bạn có chắc chắn không? Các thẻ trong "${category}" sẽ được chuyển sang danh mục "General".`)) {
            onDelete(category);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Quản Lý Danh Mục</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
                            <AlertCircle size={16} className="mr-2" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            className="input"
                            placeholder="Tên danh mục mới"
                            value={newCategory}
                            onChange={(e) => {
                                setNewCategory(e.target.value);
                                setError(null);
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!newCategory.trim()}
                            className="btn bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[3rem]"
                        >
                            <Plus size={20} />
                        </button>
                    </form>

                    <div className="space-y-2">
                        {categories.map((category) => (
                            <div key={category} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                                {editingCategory === category ? (
                                    <div className="flex items-center gap-2 flex-1 mr-2">
                                        <input
                                            type="text"
                                            className="input py-1 px-2 text-sm"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                            autoFocus
                                        />
                                        <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-100 rounded">
                                            <Check size={16} />
                                        </button>
                                        <button onClick={() => setEditingCategory(null)} className="p-1 text-slate-400 hover:bg-slate-200 rounded">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <span className="font-medium text-slate-700">{category}</span>
                                )}

                                {editingCategory !== category && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => startEdit(category)}
                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                            title="Đổi tên"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category)}
                                            disabled={category === 'General'}
                                            className={`p-1.5 rounded-md transition-colors ${category === 'General'
                                                ? 'text-slate-300 cursor-not-allowed'
                                                : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                                }`}
                                            title={category === 'General' ? 'Không thể xóa danh mục mặc định' : 'Xóa'}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
