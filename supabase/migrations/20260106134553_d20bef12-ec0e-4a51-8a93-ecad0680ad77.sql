-- Contact Messages table for storing form submissions
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (submit contact form)
CREATE POLICY "Anyone can send contact message" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Only admins can read messages
CREATE POLICY "Admins can read contact messages" ON contact_messages
  FOR SELECT USING (
    auth.email() IN ('nissenemj@gmail.com', 'maria.skon@gmail.com')
  );

-- Admins can update (mark as read)
CREATE POLICY "Admins can update contact messages" ON contact_messages
  FOR UPDATE USING (
    auth.email() IN ('nissenemj@gmail.com', 'maria.skon@gmail.com')
  );