import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { DEFAULT_CATEGORIES } from '../types';
import type { KnowledgeCard, Category, User } from '../types';

interface State {
    cards: KnowledgeCard[];
    categories: Category[];
    searchQuery: string;
    selectedCategory: string | null;
    users: User[];
    currentUser: User | null;
    isLoading: boolean;
}

interface Actions {
    fetchData: () => Promise<void>;

    addCard: (card: Omit<KnowledgeCard, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
    updateCard: (id: string, updates: Partial<Omit<KnowledgeCard, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
    deleteCard: (id: string) => Promise<void>;

    addCategory: (category: Category) => Promise<void>;
    renameCategory: (oldCategory: string, newCategory: string) => Promise<void>;
    deleteCategory: (category: string) => Promise<void>;

    setSearchQuery: (query: string) => void;
    setSelectedCategory: (category: string | null) => void;

    // User Management
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    addUser: (user: Omit<User, 'id'>) => Promise<void>;
    updateUser: (id: string, updates: Partial<Omit<User, 'id'>>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}

export const useStore = create<State & Actions>()(
    persist(
        (set, get) => ({
            cards: [],
            categories: [],
            searchQuery: '',
            selectedCategory: null,
            users: [],
            currentUser: null,
            isLoading: false,

            fetchData: async () => {
                set({ isLoading: true });
                try {
                    // Categories
                    const { data: catData } = await supabase.from('categories').select('*');
                    const loadedCategories = catData ? catData.map(c => c.name) : DEFAULT_CATEGORIES;

                    // Users
                    const { data: userData } = await supabase.from('app_users').select('*');

                    // Cards
                    const { data: cardData, error: cardError } = await supabase.from('knowledge_cards').select('*');
                    if (cardError) console.error('Error fetching cards:', cardError);

                    const mappedCards = (cardData || []).map((c: any) => ({
                        ...c,
                        createdAt: c.created_at,
                        updatedAt: c.updated_at,
                        userId: c.user_id
                    }));

                    const mappedUsers = (userData || []).map((u: any) => ({
                        ...u,
                        fullName: u.full_name
                    }));

                    set({
                        categories: loadedCategories.length > 0 ? loadedCategories : DEFAULT_CATEGORIES,
                        users: mappedUsers,
                        cards: mappedCards,
                        isLoading: false
                    });

                } catch (error) {
                    console.error('Fetch data failed:', error);
                    set({ isLoading: false });
                }
            },

            addCard: async (cardData) => {
                const state = get();
                const currentUser = state.currentUser;
                if (!currentUser) return;

                const now = Date.now();
                const newCardPayload = {
                    title: cardData.title,
                    content: cardData.content,
                    links: cardData.links,
                    category: cardData.category,
                    color: cardData.color,
                    user_id: currentUser.id,
                    created_at: now,
                    updated_at: now
                };

                const { data, error } = await supabase
                    .from('knowledge_cards')
                    .insert(newCardPayload)
                    .select()
                    .single();

                if (error) {
                    console.error('Error adding card:', error);
                    return;
                }

                const newCard: KnowledgeCard = {
                    ...data,
                    createdAt: data.created_at,
                    updatedAt: data.updated_at,
                    userId: data.user_id
                };

                set((state) => ({ cards: [newCard, ...state.cards] }));
            },

            updateCard: async (id, updates) => {
                const now = Date.now();
                const dbUpdates: any = { ...updates, updated_at: now };
                if (updates.userId) delete dbUpdates.userId;

                const { error } = await supabase
                    .from('knowledge_cards')
                    .update(dbUpdates)
                    .eq('id', id);

                if (error) {
                    console.error('Error updating card:', error);
                    return;
                }

                set((state) => ({
                    cards: state.cards.map((card) =>
                        card.id === id
                            ? { ...card, ...updates, updatedAt: now }
                            : card
                    ),
                }));
            },

            deleteCard: async (id) => {
                const { error } = await supabase.from('knowledge_cards').delete().eq('id', id);
                if (error) {
                    console.error('Error deleting card:', error);
                    return;
                }
                set((state) => ({
                    cards: state.cards.filter((card) => card.id !== id),
                }));
            },

            addCategory: async (category) => {
                const { error } = await supabase.from('categories').insert({ name: category });
                if (error) {
                    console.error('Error adding category:', error);
                    return;
                }
                set((state) => ({
                    categories: [...state.categories, category]
                }));
            },

            renameCategory: async (oldCategory, newCategory) => {
                // 1. Insert New
                const { error: insertError } = await supabase.from('categories').insert({ name: newCategory });
                if (insertError) {
                    console.error('Rename: Insert failed', insertError);
                    return;
                }
                // 2. Update Cards
                const { error: updateError } = await supabase
                    .from('knowledge_cards')
                    .update({ category: newCategory })
                    .eq('category', oldCategory);

                if (updateError) {
                    console.error('Rename: Update cards failed', updateError);
                    return;
                }
                // 3. Delete Old
                const { error: deleteError } = await supabase.from('categories').delete().eq('name', oldCategory);
                if (deleteError) console.error('Rename: Delete old failed', deleteError);

                set((state) => {
                    return {
                        categories: state.categories.map(cat => cat === oldCategory ? newCategory : cat),
                        cards: state.cards.map(card => card.category === oldCategory ? { ...card, category: newCategory } : card)
                    };
                });
            },

            deleteCategory: async (category) => {
                const { error } = await supabase.from('categories').delete().eq('name', category);
                if (error) {
                    console.error('Delete category failed', error);
                    return;
                }
                set((state) => {
                    const fallback = 'General';
                    return {
                        categories: state.categories.filter(cat => cat !== category),
                        cards: state.cards.map(card => card.category === category ? { ...card, category: fallback } : card)
                    };
                });
            },

            setSearchQuery: (query) => set({ searchQuery: query }),
            setSelectedCategory: (category) => set({ selectedCategory: category }),

            login: async (username, password) => {
                const { data, error } = await supabase
                    .from('app_users')
                    .select('*')
                    .eq('username', username)
                    .eq('password', password)
                    .single();

                if (error || !data) return false;

                const user: User = { ...data, fullName: data.full_name };
                set({ currentUser: user });
                // Also trigger fetch data immediately
                get().fetchData();
                return true;
            },

            logout: () => set({ currentUser: null, cards: [], users: [] }),

            addUser: async (userData) => {
                const payload = {
                    username: userData.username,
                    password: userData.password,
                    full_name: userData.fullName,
                    role: userData.role
                };
                const { data, error } = await supabase.from('app_users').insert(payload).select().single();
                if (error) {
                    console.error('Add user failed', error);
                    return;
                }
                const newUser: User = { ...data, fullName: data.full_name };
                set((state) => ({ users: [...state.users, newUser] }));
            },

            updateUser: async (id, updates) => {
                const payload: any = {};
                if (updates.fullName) payload.full_name = updates.fullName;
                if (updates.username) payload.username = updates.username;
                if (updates.password) payload.password = updates.password;
                if (updates.role) payload.role = updates.role;

                const { error } = await supabase.from('app_users').update(payload).eq('id', id);
                if (error) {
                    console.error('Update user failed', error);
                    return;
                }
                set((state) => ({
                    users: state.users.map(u => u.id === id ? { ...u, ...updates } : u),
                    currentUser: state.currentUser?.id === id ? { ...state.currentUser, ...updates } : state.currentUser
                }));
            },

            deleteUser: async (id) => {
                const { error } = await supabase.from('app_users').delete().eq('id', id);
                if (error) {
                    console.error('Delete user failed', error);
                    return;
                }
                set((state) => ({ users: state.users.filter(u => u.id !== id) }));
            }
        }),
        {
            name: 'knowledge-base-session',
            partialize: (state) => ({ currentUser: state.currentUser }), // Only persist session
        }
    )
);
