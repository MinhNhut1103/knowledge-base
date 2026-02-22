import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { Card } from './components/Card';
import { EditorModal } from './components/EditorModal';
import { SearchBar } from './components/SearchBar';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { CardDetailModal } from './components/CardDetailModal';
import { MemberManagerModal } from './components/MemberManagerModal';
import { LoginPage } from './components/LoginPage';
import { Plus, BookOpen, Settings, LogOut, Users } from 'lucide-react';
import type { KnowledgeCard } from './types';

function App() {
  const {
    cards,
    categories,
    searchQuery,
    selectedCategory,
    currentUser,
    addCard,
    updateCard,
    deleteCard,
    addCategory,
    renameCategory,
    deleteCategory,
    setSearchQuery,
    setSelectedCategory,
    logout,
    fetchData
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isMemberManagerOpen, setIsMemberManagerOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<KnowledgeCard | null>(null);
  const [viewingCard, setViewingCard] = useState<KnowledgeCard | null>(null);

  // Initial Data Fetch
  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  if (!currentUser) {
    return <LoginPage />;
  }

  const isAdmin = currentUser.role === 'admin';

  const filteredCards = cards.filter((card) => {
    // 1. Role-based visibility
    if (!isAdmin && card.userId !== currentUser.id) {
      return false;
    }

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      card.title.toLowerCase().includes(query) ||
      card.content.toLowerCase().includes(query) ||
      card.category.toLowerCase().includes(query) ||
      (card.links && card.links.some(link =>
        link.url.toLowerCase().includes(query) ||
        (link.label && link.label.toLowerCase().includes(query))
      ));

    const matchesCategory = selectedCategory ? card.category === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  const handleCreate = () => {
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleEdit = (card: KnowledgeCard) => {
    if (!isAdmin && card.userId !== currentUser.id) return;
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleSave = async (cardData: any) => {
    if (editingCard) {
      await updateCard(editingCard.id, cardData);
    } else {
      await addCard(cardData);
    }
  };

  const HandleDelete = async (id: string) => {
    const cardToDelete = cards.find(c => c.id === id);
    if (!cardToDelete) return;

    if (!isAdmin && cardToDelete.userId !== currentUser.id) return;

    if (confirm('Bạn có chắc chắn muốn xóa thẻ này không?')) {
      await deleteCard(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <BookOpen size={24} />
              </div>
              <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Minh Nhựt Knowledge Base</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="mr-2 text-sm text-right hidden md:block">
                <div className="font-medium text-slate-800">{currentUser.fullName}</div>
                <div className="text-slate-500 text-xs capitalize">{currentUser.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</div>
              </div>

              {isAdmin && (
                <>
                  <button
                    onClick={() => setIsMemberManagerOpen(true)}
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Quản lý thành viên"
                  >
                    <Users size={20} />
                  </button>
                  <button
                    onClick={() => setIsCategoryManagerOpen(true)}
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Quản lý danh mục"
                  >
                    <Settings size={20} />
                  </button>
                </>
              )}

              <button
                onClick={logout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>

              <button
                onClick={handleCreate}
                className="ml-2 btn bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 flex items-center"
              >
                <Plus size={20} className="mr-1" />
                <span className="hidden sm:inline">Thêm Mới</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Bộ Sưu Tập Của Bạn</h2>
          <p className="text-slate-500">Quản lý và sắp xếp các kiến thức, ý tưởng và tài nguyên của bạn.</p>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onEdit={(isAdmin || card.userId === currentUser.id) ? handleEdit : () => { }}
                onDelete={(isAdmin || card.userId === currentUser.id) ? HandleDelete : () => { }}
                onClick={setViewingCard}
                showActions={isAdmin || card.userId === currentUser.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-50 inline-flex p-4 rounded-full mb-4">
              <SearchIconPlaceholder />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-1">Không tìm thấy thẻ nào</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
              {searchQuery || selectedCategory
                ? "Thử tìm kiếm hoặc lọc danh mục khác."
                : "Bắt đầu bằng cách tạo thẻ kiến thức đầu tiên của bạn!"}
            </p>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="text-indigo-600 font-medium hover:text-indigo-800"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}
      </main>

      <EditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingCard={editingCard}
        categories={categories}
      />

      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        onAdd={addCategory}
        onRename={renameCategory}
        onDelete={deleteCategory}
      />

      <MemberManagerModal
        isOpen={isMemberManagerOpen}
        onClose={() => setIsMemberManagerOpen(false)}
      />

      <CardDetailModal
        isOpen={!!viewingCard}
        onClose={() => setViewingCard(null)}
        card={viewingCard}
        onEdit={(isAdmin || (viewingCard && viewingCard.userId === currentUser.id)) ? handleEdit : () => { }}
        onDelete={(isAdmin || (viewingCard && viewingCard.userId === currentUser.id)) ? HandleDelete : () => { }}
      />

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Minh Nhựt Knowledge Base. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function SearchIconPlaceholder() {
  return (
    <svg
      className="w-8 h-8 text-slate-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

export default App;
