-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'citoyen',
    quartier_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des quartiers
CREATE TABLE IF NOT EXISTS quartiers (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    ville VARCHAR(100) NOT NULL
);

-- Table des bacs
CREATE TABLE IF NOT EXISTS bacs (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(50) UNIQUE NOT NULL,
    quartier_id INTEGER REFERENCES quartiers(id),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    type VARCHAR(50),
    capteur_id VARCHAR(100) UNIQUE,
    seuil_alerte INTEGER DEFAULT 80,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des lectures capteurs
CREATE TABLE IF NOT EXISTS lectures_capteurs (
    id BIGSERIAL PRIMARY KEY,
    bac_id INTEGER REFERENCES bacs(id) ON DELETE CASCADE,
    niveau_remplissage INTEGER CHECK (niveau_remplissage BETWEEN 0 AND 100),
    batterie INTEGER CHECK (batterie BETWEEN 0 AND 100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des collectes
CREATE TABLE IF NOT EXISTS collectes (
    id BIGSERIAL PRIMARY KEY,
    bac_id INTEGER REFERENCES bacs(id) ON DELETE CASCADE,
    agent VARCHAR(255),
    camion_id VARCHAR(100),
    date_collecte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    niveau_avant INTEGER CHECK (niveau_avant BETWEEN 0 AND 100),
    note TEXT
);

-- Table des signalements
CREATE TABLE IF NOT EXISTS signalements (
    id SERIAL PRIMARY KEY,
    citoyen_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    description TEXT,
    photo_url VARCHAR(255),
    statut VARCHAR(50) DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des tournées optimisées
CREATE TABLE IF NOT EXISTS tournees_optimisees (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    quartier_id INTEGER REFERENCES quartiers(id),
    tournee_data JSONB NOT NULL,
    distance_km DECIMAL(10,2),
    duree_minutes INTEGER,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_collectes_bac_id ON collectes(bac_id);
CREATE INDEX idx_collectes_date ON collectes(date_collecte);
CREATE INDEX idx_tournees_created_at ON tournees_optimisees(created_at);