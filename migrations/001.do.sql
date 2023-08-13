CREATE TYPE user_role AS ENUM ('user', 'creator');

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  chat_id INTEGER UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  lang CHAR(2) NOT NULL DEFAULT 'en',
  role user_role NOT NULL DEFAULT 'user',
  current_action VARCHAR(50),
  current_action_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  code VARCHAR(30) UNIQUE,
  name VARCHAR(30) NOT NULL,
  description TEXT NOT NULL,
  prize TEXT NOT NULL,
  required_winners SMALLINT CHECK (required_winners >= 0) NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE users_events (
  user_id INTEGER REFERENCES users(id),
  event_id INTEGER REFERENCES events(id),
  is_winner BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, event_id)
);