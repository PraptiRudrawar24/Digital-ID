-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student', -- 'student' or 'admin'
    department VARCHAR(100),
    photo TEXT, -- URL or base64
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ID Cards Table
CREATE TABLE idcards (
    id SERIAL PRIMARY KEY,
    id_uuid UUID UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    id_number VARCHAR(50) NOT NULL,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'revoked', 'expired'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Verification Logs Table
CREATE TABLE verification_logs (
    id SERIAL PRIMARY KEY,
    id_uuid UUID REFERENCES idcards(id_uuid),
    result VARCHAR(50), -- 'VALID', 'INVALID', 'EXPIRED', 'REVOKED'
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
