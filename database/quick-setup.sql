-- Quick Database Setup for HomeKey Property Intelligence
-- Run this for a minimal setup with core tables only

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE property_type_enum AS ENUM (
    'single_family',
    'condo',
    'townhouse',
    'multi_family'
);

CREATE TYPE listing_status_enum AS ENUM (
    'active',
    'pending',
    'sold',
    'off_market'
);

-- Users table (Clerk integration)
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY, -- Clerk user ID
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    price DECIMAL(12, 2) NOT NULL,
    square_feet INTEGER,
    bedrooms INTEGER,
    bathrooms DECIMAL(3, 1),
    year_built INTEGER,
    property_type property_type_enum,
    listing_status listing_status_enum DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Favorites table
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

-- Basic indexes
CREATE INDEX idx_properties_location ON properties(city, state);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);

-- Sample data
INSERT INTO users (id, email, first_name, last_name) VALUES
('user_123', 'john.doe@example.com', 'John', 'Doe');

INSERT INTO properties (address, city, state, zip_code, price, square_feet, bedrooms, bathrooms, year_built, property_type) VALUES
('123 Main St', 'San Francisco', 'CA', '94102', 1250000.00, 1800, 3, 2.0, 1955, 'single_family'),
('456 Oak Ave', 'San Francisco', 'CA', '94103', 950000.00, 1500, 2, 1.5, 1980, 'condo');
