import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { Category } from '../types';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
    categories: Category[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories
}) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="input pl-10 bg-white"
                    placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc từ khóa..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="relative md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-slate-400" />
                </div>
                <select
                    className="input pl-10 bg-white appearance-none cursor-pointer"
                    value={selectedCategory || ''}
                    onChange={(e) => onCategoryChange(e.target.value || null)}
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
