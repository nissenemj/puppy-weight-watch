import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/contexts/UserContext';
import {
  puppyBookImagePath,
  signPuppyBookImage,
  PUPPY_IMAGE_URL_TTL,
} from '@/services/puppyBookStorage';

const REFRESH_MS = 240_000;

export function usePuppyBookImage(reference?: string | null) {
  const { user, loading } = useUser();
  const ownerId = user?.id;
  const path = puppyBookImagePath(reference);
  const enabled = !loading && !!ownerId && !!path;
  const query = useQuery({
    queryKey: ['private-puppy-image', ownerId, path],
    enabled,
    queryFn: async () => {
      if (!ownerId || !path) throw new Error('Kuvan käyttöoikeus puuttuu.');
      const expiresAt = Date.now() + PUPPY_IMAGE_URL_TTL * 1000;
      const signedUrl = await signPuppyBookImage(path);
      return { ownerId, path, signedUrl, expiresAt };
    },
    staleTime: REFRESH_MS,
    refetchInterval: REFRESH_MS,
    gcTime: 0,
    retry: false,
  });

  // Do not expose a previous account/path, expired link or data retained after a denied refresh.
  const signedUrl =
    enabled &&
    !query.isError &&
    query.data?.ownerId === ownerId &&
    query.data.path === path &&
    query.data.expiresAt > Date.now()
      ? query.data.signedUrl
      : undefined;
  return { signedUrl, isLoading: enabled && query.isPending };
}
