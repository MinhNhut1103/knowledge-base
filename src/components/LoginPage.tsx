import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Lock, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const { login } = useStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(username, password);
        if (!success) {
            setError('Tên đăng nhập hoặc mật khẩu không đúng');
        } else {
            setError('');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="bg-indigo-600 p-8 text-center">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Lock className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Minh Nhựt Knowledge Base</h1>
                    <p className="text-indigo-100">Vui lòng đăng nhập để tiếp tục</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tên đăng nhập</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="text-slate-400" size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="input pl-10"
                                    placeholder="admin"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="text-slate-400" size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="input pl-10"
                                    placeholder="••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 py-3"
                        >
                            Đăng Nhập
                        </button>

                        <div className="text-center text-xs text-slate-400 mt-4">
                            Mặc định: admin / 123456
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
