import React, { useState, useEffect } from 'react';
import { PRESET_COLORS, DEFAULT_CATEGORIES } from '../types';
import type { KnowledgeCard, Link } from '../types';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface EditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (card: any) => void;
    editingCard?: KnowledgeCard | null;
    categories: string[];
}

export const EditorModal: React.FC<EditorModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingCard,
    categories
}) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        links: [] as Link[],
        category: DEFAULT_CATEGORIES[0],
        color: PRESET_COLORS[5], // Blue default
        customColor: '#000000',
        useCustomColor: false,
    });

    const [newCategory, setNewCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    useEffect(() => {
        if (editingCard) {
            const isPreset = PRESET_COLORS.includes(editingCard.color);
            setFormData({
                title: editingCard.title,
                content: editingCard.content,
                links: editingCard.links || [],
                category: editingCard.category,
                color: isPreset ? editingCard.color : PRESET_COLORS[5],
                customColor: isPreset ? '#000000' : editingCard.color,
                useCustomColor: !isPreset,
            });
        } else {
            setFormData({
                title: '',
                content: '',
                links: [],
                category: DEFAULT_CATEGORIES[0],
                color: PRESET_COLORS[5],
                customColor: '#000000',
                useCustomColor: false,
            });
        }
    }, [editingCard, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalColor = formData.useCustomColor ? formData.customColor : formData.color;

        // Add new category to the list if it's being used
        let finalCategory = formData.category;
        if (isAddingCategory && newCategory.trim()) {
            finalCategory = newCategory.trim();
        }

        // Filter out empty links
        const cleanLinks = formData.links.filter(l => l.url.trim() !== '');

        onSave({
            ...formData,
            links: cleanLinks,
            color: finalColor,
            category: finalCategory
        });
        onClose();
    };

    const addLink = () => {
        setFormData({ ...formData, links: [...formData.links, { url: '', label: '' }] });
    };

    const removeLink = (index: number) => {
        const newLinks = formData.links.filter((_, i) => i !== index);
        setFormData({ ...formData, links: newLinks });
    };

    const updateLink = (index: number, field: keyof Link, value: string) => {
        const newLinks = [...formData.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setFormData({ ...formData, links: newLinks });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">
                        {editingCard ? 'Chỉnh Sửa Thẻ' : 'Tạo Thẻ Mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu Đề</label>
                            <input
                                type="text"
                                required
                                className="input"
                                placeholder="Nhập tiêu đề mô tả..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Danh Mục</label>
                            <div className="flex gap-2">
                                {!isAddingCategory ? (
                                    <select
                                        className="input"
                                        value={formData.category}
                                        onChange={(e) => {
                                            if (e.target.value === 'new') {
                                                setIsAddingCategory(true);
                                            } else {
                                                setFormData({ ...formData, category: e.target.value });
                                            }
                                        }}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                        <option value="new">+ Thêm danh mục mới</option>
                                    </select>
                                ) : (
                                    <div className="flex gap-2 w-full">
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Tên danh mục mới"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            className="btn bg-slate-100 text-slate-600"
                                            onClick={() => setIsAddingCategory(false)}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Liên Kết</label>
                            <div className="space-y-3">
                                {formData.links.map((link, index) => (
                                    <div key={index} className="flex gap-2 items-start">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="Nhãn (tùy chọn)"
                                                value={link.label || ''}
                                                onChange={(e) => updateLink(index, 'label', e.target.value)}
                                            />
                                            <input
                                                type="url"
                                                className="input"
                                                placeholder="https://..."
                                                value={link.url}
                                                onChange={(e) => updateLink(index, 'url', e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeLink(index)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                                            title="Xóa liên kết"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addLink}
                                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                                >
                                    <Plus size={16} className="mr-1" /> Thêm Liên Kết
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Màu Sắc</label>
                            <div className="flex flex-wrap gap-3 items-center">
                                {PRESET_COLORS.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color, useCustomColor: false })}
                                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${!formData.useCustomColor && formData.color === color
                                            ? 'border-slate-800 ring-2 ring-slate-200 ring-offset-2'
                                            : 'border-transparent'
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}

                                <div className="ml-2 pl-4 border-l border-slate-200 flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={formData.customColor}
                                        onChange={(e) => setFormData({ ...formData, customColor: e.target.value, useCustomColor: true })}
                                        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                        title="Màu tùy chọn"
                                    />
                                    <span className="text-xs text-slate-500">Tùy chỉnh</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Nội Dung
                            </label>
                            <textarea
                                required
                                rows={6}
                                className="input resize-none"
                                placeholder="Viết kiến thức, ghi chú của bạn tại đây..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="btn bg-indigo-600 text-white hover:bg-indigo-700 flex items-center shadow-md shadow-indigo-200"
                        >
                            <Save size={18} className="mr-2" />
                            {editingCard ? 'Lưu Thay Đổi' : 'Tạo Thẻ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
