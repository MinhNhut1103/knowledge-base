import React from 'react';
import type { KnowledgeCard } from '../types';
import { ExternalLink, Calendar, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps {
    card: KnowledgeCard;
    onEdit: (card: KnowledgeCard) => void;
    onDelete: (id: string) => void;
    onClick: (card: KnowledgeCard) => void;
    showActions?: boolean;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export const Card: React.FC<CardProps> = ({ card, onEdit, onDelete, onClick, showActions = true }) => {
    return (
        <div
            onClick={() => onClick(card)}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full group cursor-pointer hover:-translate-y-1 transform"
            style={{ borderTop: `4px solid ${card.color}` }}
        >
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-full">
                        {card.category}
                    </span>
                    {showActions && (
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(card);
                                }}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                title="Sửa"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(card.id);
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Xóa"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2" title={card.title}>
                    {card.title}
                </h3>

                <p className="text-slate-600 text-sm mb-4 line-clamp-4 flex-grow whitespace-pre-wrap">
                    {card.content}
                </p>

                {card.links && card.links.length > 0 && (
                    <div className="mt-auto mb-3 space-y-1">
                        {card.links.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors truncate"
                                title={link.url}
                            >
                                <ExternalLink size={14} className="mr-1 flex-shrink-0" />
                                <span className="truncate">{link.label || 'Truy cập liên kết'}</span>
                            </a>
                        ))}
                    </div>
                )}

                <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center" title={`Tạo: ${format(card.createdAt, 'PPP')}`}>
                        <Calendar size={12} className="mr-1" />
                        {format(card.updatedAt, 'dd/MM/yyyy')}
                    </div>
                </div>
            </div>
        </div>
    );
};
