CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  roles VARCHAR(255) ARRAY NOT NULL
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  description VARCHAR(1024) NOT NULL,
  prize VARCHAR(512) NOT NULL,
  required_winners INTEGER NOT NULL
);

CREATE TABLE users_events (
  user_id INTEGER REFERENCES users(id),
  event_id INTEGER REFERENCES events(id),
  PRIMARY KEY (user_id, event_id)
);