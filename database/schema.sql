-- HomeKey Property Intelligence Database Schema
-- PostgreSQL Database Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE property_type_enum AS ENUM (
    'single_family',
    'condo',
    'townhouse',
    'multi_family',
    'apartment',
    'land',
    'commercial'
);

CREATE TYPE listing_status_enum AS ENUM (
    'active',
    'pending',
    'sold',
    'off_market',
    'withdrawn',
    'expired'
);

CREATE TYPE school_type_enum AS ENUM (
    'elementary',
    'middle',
    'high',
    'charter',
    'private'
);

-- Users table (integrates with Clerk)
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY, -- Clerk user ID
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    profile_image_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    
    -- Basic Property Info
    price DECIMAL(12, 2) NOT NULL,
    price_per_sqft DECIMAL(8, 2),
    square_feet INTEGER,
    lot_size DECIMAL(10, 2),
    bedrooms INTEGER,
    bathrooms DECIMAL(3, 1),
    year_built INTEGER,
    property_type property_type_enum,
    
    -- Property Features
    features JSONB DEFAULT '{}',
    description TEXT,
    
    -- Market Data
    days_on_market INTEGER,
    listing_status listing_status_enum DEFAULT 'active',
    mls_number VARCHAR(50),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property Images table
CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type VARCHAR(50), -- exterior, interior, kitchen, bathroom, etc.
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property History table
CREATE TABLE property_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- price_change, status_change, new_listing
    event_date DATE NOT NULL,
    old_value TEXT,
    new_value TEXT,
    details JSONB DEFAULT '{}',
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

-- User Searches table
CREATE TABLE user_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    search_criteria JSONB NOT NULL,
    search_name VARCHAR(255),
    is_saved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property Comparisons table
CREATE TABLE property_comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comparison_name VARCHAR(255),
    property_ids UUID[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Neighborhoods table
CREATE TABLE neighborhoods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10),
    
    -- Location Intelligence
    walk_score INTEGER CHECK (walk_score >= 0 AND walk_score <= 100),
    transit_score INTEGER CHECK (transit_score >= 0 AND transit_score <= 100),
    bike_score INTEGER CHECK (bike_score >= 0 AND bike_score <= 100),
    crime_rate DECIMAL(5, 2),
    
    -- Demographics
    median_income DECIMAL(10, 2),
    population INTEGER,
    median_age DECIMAL(4, 1),
    
    -- Amenities
    amenities JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schools table
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    school_type school_type_enum,
    district VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10),
    
    -- School Ratings
    rating DECIMAL(3, 1) CHECK (rating >= 0 AND rating <= 10),
    test_scores JSONB DEFAULT '{}',
    
    -- Location
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property-School Relationships table
CREATE TABLE property_schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    distance_miles DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(property_id, school_id)
);

-- Create Indexes for Performance
CREATE INDEX idx_properties_location ON properties(city, state, zip_code);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_coordinates ON properties(latitude, longitude);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_status ON properties(listing_status);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_bathrooms ON properties(bathrooms);
CREATE INDEX idx_properties_sqft ON properties(square_feet);
CREATE INDEX idx_properties_year_built ON properties(year_built);

CREATE INDEX idx_property_images_property_id ON property_images(property_id);
CREATE INDEX idx_property_images_type ON property_images(image_type);

CREATE INDEX idx_property_history_property_id ON property_history(property_id);
CREATE INDEX idx_property_history_event_date ON property_history(event_date);
CREATE INDEX idx_property_history_event_type ON property_history(event_type);

CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_property_id ON user_favorites(property_id);

CREATE INDEX idx_user_searches_user_id ON user_searches(user_id);
CREATE INDEX idx_user_searches_saved ON user_searches(is_saved);

CREATE INDEX idx_property_comparisons_user_id ON property_comparisons(user_id);

CREATE INDEX idx_neighborhoods_location ON neighborhoods(city, state);
CREATE INDEX idx_neighborhoods_scores ON neighborhoods(walk_score, transit_score, bike_score);

CREATE INDEX idx_schools_location ON schools(city, state);
CREATE INDEX idx_schools_type ON schools(school_type);
CREATE INDEX idx_schools_rating ON schools(rating);

CREATE INDEX idx_property_schools_property_id ON property_schools(property_id);
CREATE INDEX idx_property_schools_school_id ON property_schools(school_id);

-- Create Functions for Updated At Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create Triggers for Updated At
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_comparisons_updated_at BEFORE UPDATE ON property_comparisons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_neighborhoods_updated_at BEFORE UPDATE ON neighborhoods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert Sample Data for Testing
INSERT INTO users (id, email, first_name, last_name, preferences) VALUES
('user_123', 'john.doe@example.com', 'John', 'Doe', '{"notifications": true, "price_alerts": true}'),
('user_456', 'jane.smith@example.com', 'Jane', 'Smith', '{"notifications": false, "price_alerts": true}');

INSERT INTO properties (address, city, state, zip_code, latitude, longitude, price, price_per_sqft, square_feet, bedrooms, bathrooms, year_built, property_type, features, description, days_on_market, listing_status) VALUES
('123 Main St', 'San Francisco', 'CA', '94102', 37.7749, -122.4194, 1250000.00, 694.44, 1800, 3, 2.0, 1955, 'single_family', '{"garage": true, "pool": false, "fireplace": true, "updated_kitchen": true}', 'Beautiful Victorian home in the heart of San Francisco', 45, 'active'),
('456 Oak Ave', 'San Francisco', 'CA', '94103', 37.7849, -122.4094, 950000.00, 633.33, 1500, 2, 1.5, 1980, 'condo', '{"garage": false, "pool": true, "fireplace": false, "updated_kitchen": false}', 'Modern condo with city views', 23, 'active'),
('789 Pine St', 'San Francisco', 'CA', '94104', 37.7949, -122.3994, 1800000.00, 900.00, 2000, 4, 3.0, 2010, 'single_family', '{"garage": true, "pool": true, "fireplace": true, "updated_kitchen": true}', 'Luxury home with premium finishes', 12, 'pending');

INSERT INTO property_images (property_id, image_url, image_type, display_order) VALUES
((SELECT id FROM properties WHERE address = '123 Main St'), 'https://example.com/images/prop1_exterior.jpg', 'exterior', 1),
((SELECT id FROM properties WHERE address = '123 Main St'), 'https://example.com/images/prop1_living.jpg', 'interior', 2),
((SELECT id FROM properties WHERE address = '456 Oak Ave'), 'https://example.com/images/prop2_exterior.jpg', 'exterior', 1),
((SELECT id FROM properties WHERE address = '789 Pine St'), 'https://example.com/images/prop3_exterior.jpg', 'exterior', 1);

INSERT INTO neighborhoods (name, city, state, zip_code, walk_score, transit_score, bike_score, crime_rate, median_income, population, median_age, amenities) VALUES
('Downtown', 'San Francisco', 'CA', '94102', 95, 88, 85, 2.5, 120000, 15000, 35.2, '{"restaurants": 50, "shopping": 25, "parks": 5, "gyms": 8}'),
('Mission District', 'San Francisco', 'CA', '94103', 88, 82, 90, 3.2, 95000, 12000, 32.8, '{"restaurants": 35, "shopping": 15, "parks": 8, "gyms": 5}'),
('Financial District', 'San Francisco', 'CA', '94104', 92, 95, 75, 1.8, 150000, 8000, 38.5, '{"restaurants": 30, "shopping": 20, "parks": 3, "gyms": 12}');

INSERT INTO schools (name, school_type, district, city, state, zip_code, rating, test_scores, latitude, longitude) VALUES
('Lincoln Elementary', 'elementary', 'San Francisco Unified', 'San Francisco', 'CA', '94102', 8.5, '{"math": 85, "reading": 88, "science": 82}', 37.7749, -122.4194),
('Mission High School', 'high', 'San Francisco Unified', 'San Francisco', 'CA', '94103', 7.8, '{"math": 78, "reading": 82, "science": 75}', 37.7849, -122.4094),
('Washington Elementary', 'elementary', 'San Francisco Unified', 'San Francisco', 'CA', '94104', 9.2, '{"math": 92, "reading": 89, "science": 94}', 37.7949, -122.3994);

INSERT INTO property_schools (property_id, school_id, distance_miles) VALUES
((SELECT id FROM properties WHERE address = '123 Main St'), (SELECT id FROM schools WHERE name = 'Lincoln Elementary'), 0.3),
((SELECT id FROM properties WHERE address = '456 Oak Ave'), (SELECT id FROM schools WHERE name = 'Mission High School'), 0.5),
((SELECT id FROM properties WHERE address = '789 Pine St'), (SELECT id FROM schools WHERE name = 'Washington Elementary'), 0.2);

INSERT INTO property_history (property_id, event_type, event_date, old_value, new_value, details) VALUES
((SELECT id FROM properties WHERE address = '123 Main St'), 'price_change', '2024-01-15', '1200000', '1250000', '{"reason": "market_adjustment"}'),
((SELECT id FROM properties WHERE address = '456 Oak Ave'), 'new_listing', '2024-02-01', NULL, '950000', '{"agent": "Jane Smith", "mls": "SF123456"}'),
((SELECT id FROM properties WHERE address = '789 Pine St'), 'status_change', '2024-02-10', 'active', 'pending', '{"offer_accepted": true}');

-- Create Views for Common Queries
CREATE VIEW property_summary AS
SELECT 
    p.id,
    p.address,
    p.city,
    p.state,
    p.zip_code,
    p.price,
    p.price_per_sqft,
    p.square_feet,
    p.bedrooms,
    p.bathrooms,
    p.year_built,
    p.property_type,
    p.listing_status,
    p.days_on_market,
    n.walk_score,
    n.transit_score,
    n.bike_score,
    n.crime_rate,
    COUNT(pi.id) as image_count
FROM properties p
LEFT JOIN neighborhoods n ON p.city = n.city AND p.state = n.state
LEFT JOIN property_images pi ON p.id = pi.property_id
GROUP BY p.id, n.walk_score, n.transit_score, n.bike_score, n.crime_rate;

CREATE VIEW user_favorites_summary AS
SELECT 
    uf.user_id,
    uf.property_id,
    p.address,
    p.city,
    p.state,
    p.price,
    p.bedrooms,
    p.bathrooms,
    p.square_feet,
    p.listing_status,
    uf.created_at as favorited_at
FROM user_favorites uf
JOIN properties p ON uf.property_id = p.id;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_app_user;

COMMENT ON TABLE users IS 'User accounts integrated with Clerk authentication';
COMMENT ON TABLE properties IS 'Real estate property listings and details';
COMMENT ON TABLE property_images IS 'Images associated with properties';
COMMENT ON TABLE property_history IS 'Historical changes to property data';
COMMENT ON TABLE user_favorites IS 'Properties favorited by users';
COMMENT ON TABLE user_searches IS 'User search history and saved searches';
COMMENT ON TABLE property_comparisons IS 'User-created property comparisons';
COMMENT ON TABLE neighborhoods IS 'Neighborhood data and location intelligence';
COMMENT ON TABLE schools IS 'School information and ratings';
COMMENT ON TABLE property_schools IS 'Relationship between properties and nearby schools';
