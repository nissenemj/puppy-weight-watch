/**
 * Admin utility functions for checking user permissions
 * 
 * IMPORTANT: This is a client-side convenience check only.
 * All actual permission enforcement MUST be done via RLS policies in Supabase.
 */

const ADMIN_EMAILS = [
  'nissenemj@gmail.com',
  'maria.skon@gmail.com'
] as const;

/**
 * Check if a user email is in the admin list
 * NOTE: This is for UI purposes only. Server-side RLS policies enforce actual access control.
 */
export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase() as typeof ADMIN_EMAILS[number]);
}

/**
 * Get the list of admin emails (for reference)
 */
export function getAdminEmails(): readonly string[] {
  return ADMIN_EMAILS;
}
