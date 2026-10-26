import { supabase, SUPABASE_URL } from '@/integrations/supabase/client';

export const PUPPY_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const PUPPY_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';
export const PUPPY_IMAGE_URL_TTL = 300;
const BUCKET = 'puppy-books';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MIME_EXTENSIONS = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

function hasControlCharacter(value: string): boolean {
  return Array.from(value).some(
    (character) =>
      character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
  );
}

/** Accept saved object paths and old URLs from this project's puppy-books bucket only. */
export function puppyBookImagePath(reference?: string | null): string | null {
  if (!reference || hasControlCharacter(reference) || reference.includes('\\'))
    return null;
  let path = reference;

  if (/^https:\/\//.test(reference)) {
    try {
      const url = new URL(reference);
      if (
        url.origin !== new URL(SUPABASE_URL).origin ||
        url.username ||
        url.password ||
        url.hash
      )
        return null;
      // Inspect the original path before URL parsing can normalize traversal segments.
      const rawPath = reference.match(/^https:\/\/[^/]+(\/[^?#]*)/)?.[1];
      const prefix =
        /^\/storage\/v1\/object\/(?:public|sign|authenticated)\/puppy-books\//;
      if (!rawPath || !prefix.test(rawPath) || /%2f|%5c/i.test(rawPath))
        return null;
      path = decodeURIComponent(rawPath.replace(prefix, ''));
    } catch {
      return null;
    }
  }

  if (hasControlCharacter(path) || /[\\%?#]/.test(path)) return null;
  const segments = path.split('/');
  if (segments.length < 2 || !UUID.test(segments[0])) return null;
  if (
    segments.some((segment) => !segment || segment === '.' || segment === '..')
  )
    return null;
  return path;
}

export function validatePuppyImage(file: File): string | null {
  if (!MIME_EXTENSIONS.has(file.type))
    return 'Valitse JPEG-, PNG- tai WebP-kuva.';
  if (file.size === 0) return 'Kuvatiedosto on tyhjä.';
  if (file.size > PUPPY_IMAGE_MAX_BYTES) return 'Kuvan enimmäiskoko on 5 Mt.';
  return null;
}

/** Persist only this stable path. Signed URLs must never be saved as profile/memory data. */
export async function uploadPuppyBookImage(
  file: File,
  bookId?: string,
): Promise<string> {
  const validationError = validatePuppyImage(file);
  if (validationError) throw new Error(validationError);
  if (bookId && !UUID.test(bookId))
    throw new Error('Pentukirjan tunniste on virheellinen.');
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || !UUID.test(data.user.id))
    throw new Error('Kirjaudu sisään ennen kuvan lisäämistä.');

  const folder = bookId ? `books/${bookId}` : 'puppy-profile';
  const path = `${data.user.id}/${folder}/${crypto.randomUUID()}.${MIME_EXTENSIONS.get(file.type)}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
      cacheControl: '300',
    });
  if (uploadError)
    throw new Error(
      'Kuvan tallennus epäonnistui. Tarkista yhteys ja käyttöoikeus.',
    );
  return path;
}

export async function signPuppyBookImage(reference: string): Promise<string> {
  const path = puppyBookImagePath(reference);
  if (!path) throw new Error('Kuvan tallennuspolku on virheellinen.');
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, PUPPY_IMAGE_URL_TTL);
  if (error || !data?.signedUrl)
    throw new Error('Kuvaa ei voi avata tällä käyttäjällä.');
  return data.signedUrl;
}

export async function removePuppyBookImage(reference: string): Promise<void> {
  const path = puppyBookImagePath(reference);
  if (!path)
    throw new Error(
      'Kuvan tallennuspolku on virheellinen. Poisto keskeytettiin.',
    );
  const { data, error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error || data?.length !== 1)
    throw new Error('Kuvan poistaminen epäonnistui. Muistoa ei poistettu.');
}
