-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS app_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Storing plain/simple hash as per demo requirements (Production: Use Supabase Auth)
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Admin
INSERT INTO app_users (username, password, full_name, role)
VALUES ('admin', '123456', 'Administrator', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    name TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Categories
INSERT INTO categories (name) VALUES 
('General'), ('Work'), ('Personal'), ('Ideas'), ('Resources')
ON CONFLICT (name) DO NOTHING;

-- 3. Knowledge Cards Table
CREATE TABLE IF NOT EXISTS knowledge_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    links JSONB DEFAULT '[]'::jsonb, -- Stores array of {url, label}
    category TEXT REFERENCES categories(name) ON DELETE SET DEFAULT DEFAULT 'General',
    color TEXT NOT NULL,
    user_id UUID REFERENCES app_users(id) ON DELETE CASCADE,
    created_at BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000), -- Store as milliseconds to match existing frontend types
    updated_at BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)
);

-- Row Level Security (RLS) - Optional/Advanced
-- For this simplified demo where we handle auth in the app logic, 
-- we can leave RLS off or enable it for stricter security if using Supabase Auth.
-- We will proceed with application-level strictness for now as requested.
ALTER TABLE knowledge_cards ENABLE ROW LEVEL SECURITY;

-- Policy: Admin sees all
CREATE POLICY "Admin can see all cards" ON knowledge_cards
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM app_users 
        WHERE id = (SELECT id FROM app_users WHERE username = current_setting('app.current_username', true)) 
        AND role = 'admin'
    )
);
-- Note: The above RLS is tricky without Supabase Auth context. 
-- We will SKIP RLS setup to keep it simple for this custom auth implementation 
-- and rely on the Backend API (Project API keys) handling requests.
ALTER TABLE knowledge_cards DISABLE ROW LEVEL SECURITY;