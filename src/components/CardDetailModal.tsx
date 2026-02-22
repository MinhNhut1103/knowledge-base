import React from 'react';
import type { KnowledgeCard } from '../types';
import { X, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface CardDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    card: KnowledgeCard | null;
    onEdit: (card: KnowledgeCard) => void;
    onDelete: (id: string) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
    isOpen,
    onClose,
    card,
    onEdit,
    onDelete
}) => {
    if (!isOpen || !card) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden"
                style={{ borderTop: `6px solid ${card.color}` }}
            >
                <div className="flex items-start justify-between p-6 border-b border-slate-100">
                    <div className="pr-8">
                        <span className="inline-block px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-full mb-3">
                            {card.category}
                        </span>
                        <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                            {card.title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="prose prose-slate max-w-none mb-6">
                        <p className="whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
                            {card.content}
                        </p>
                    </div>

                    {card.links && card.links.length > 0 && (
                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Liên Kết</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {card.links.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group"
                                    >
                                        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-md mr-3 group-hover:bg-indigo-200 transition-colors">
                                            <ExternalLink size={18} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="font-medium text-slate-700 truncate group-hover:text-indigo-700 transition-colors">
                                                {link.label || link.url}
                                            </div>
                                            {link.label && (
                                                <div className="text-xs text-slate-400 truncate mt-0.5">
                                                    {link.url}
                                                </div>
                                            )}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col text-xs text-slate-500 w-full sm:w-auto">
                        <div className="flex items-center mb-1">
                            <span className="w-14 inline-block opacity-70">Tạo:</span>
                            <span className="font-medium">{format(card.createdAt, 'PP p')}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-14 inline-block opacity-70">Cập nhật:</span>
                            <span className="font-medium">{format(card.updatedAt, 'PP p')}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => {
                                onEdit(card);
                                onClose();
                            }}
                            className="flex-1 sm:flex-none btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center justify-center shadow-sm"
                        >
                            <Edit2 size={16} className="mr-2" />
                            Sửa
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('Bạn có chắc chắn muốn xóa thẻ này không?')) {
                                    onDelete(card.id);
                                    onClose();
                                }
                            }}
                            className="flex-1 sm:flex-none btn bg-white border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex items-center justify-center shadow-sm"
                        >
                            <Trash2 size={16} className="mr-2" />
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
