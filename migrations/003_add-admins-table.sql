CREATE TABLE public.admins (
    id SERIAL PRIMARY KEY,                               -- Unique admin ID (auto-increment)
    username VARCHAR(100) UNIQUE NOT NULL,               -- Admin login username (must be unique)
    password VARCHAR(255) NOT NULL,                      -- Login password (plain or hashed)
    role VARCHAR(50) DEFAULT 'admin',                    -- Role type (e.g. admin, superadmin)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP       -- Account creation timestamp
);

ALTER TABLE public.admins OWNER TO postgres;
