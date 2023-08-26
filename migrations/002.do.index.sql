CREATE INDEX idx_users_id ON users(id);

CREATE INDEX idx_events_createdBy ON events(created_by);

CREATE INDEX idx_events_id ON events(id);

CREATE INDEX idx_users_events_eventId ON users_events(event_id);

CREATE INDEX idx_events_code ON events(code);
