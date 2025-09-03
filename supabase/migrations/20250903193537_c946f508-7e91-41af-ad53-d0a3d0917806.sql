-- Add privacy settings to individual memories
ALTER TABLE memories ADD COLUMN privacy_settings jsonb DEFAULT '{"visibility": "private", "shareWithCommunity": false}'::jsonb;

-- Create index for better performance on privacy queries
CREATE INDEX idx_memories_privacy_visibility ON memories ((privacy_settings->>'visibility'));
CREATE INDEX idx_memories_privacy_community ON memories ((privacy_settings->>'shareWithCommunity'));