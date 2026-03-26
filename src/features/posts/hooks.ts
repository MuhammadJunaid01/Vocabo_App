import NetInfo from '@react-native-community/netinfo';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Comment, Post } from '../../core/types';
import { storage } from '../../core/utils/storage';
import { fetchComments, fetchPosts, PAGE_SIZE } from './api';

// ─── Paginated Posts Hook (Infinite Scroll + Offline Support) ─────────────────
export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);

  // ── Helper: persist all currently loaded posts to AsyncStorage ──────────────
  const persistToCache = useCallback(async (data: Post[]) => {
    try {
      await storage.setItem(storage.KEYS.POSTS, data);
    } catch {
      // Cache failures are non-fatal
    }
  }, []);

  // ── Helper: load cached posts from AsyncStorage ─────────────────────────────
  const loadFromCache = useCallback(async (): Promise<Post[]> => {
    try {
      const cached = await storage.getItem(storage.KEYS.POSTS);
      return cached ?? [];
    } catch {
      return [];
    }
  }, []);

  // ── Core page loader ────────────────────────────────────────────────────────
  const loadPage = useCallback(
    async (page: number, isRefresh: boolean) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      isRefresh ? setLoading(true) : setLoadingMore(true);
      setError(null);

      // Check network state first
      const netState = await NetInfo.fetch();
      const online = !!netState.isConnected && !!netState.isInternetReachable;

      if (!online) {
        // ── OFFLINE PATH ──────────────────────────────────────────────────────
        setIsOffline(true);
        if (isRefresh) {
          const cached = await loadFromCache();
          if (cached.length > 0) {
            setPosts(cached);
            setError('You are offline. Showing cached data.');
          } else {
            setError('No internet connection and no cached data available.');
          }
          setHasMore(false); // no pagination when offline
        }
        // Don't try to load more when offline
      } else {
        // ── ONLINE PATH ───────────────────────────────────────────────────────
        setIsOffline(false);
        try {
          const data = await fetchPosts(page);
          setPosts((prev) => {
            const updated = isRefresh ? data : [...prev, ...data];
            // Cache the full accumulated list every time
            persistToCache(updated);
            return updated;
          });
          setHasMore(data.length === PAGE_SIZE);
        } catch (err: any) {
          // Network call failed even though we thought we were online
          if (isRefresh) {
            const cached = await loadFromCache();
            if (cached.length > 0) {
              setPosts(cached);
              setHasMore(false);
              setError('Failed to fetch. Showing cached data.');
            } else {
              setError(err?.message ?? 'Failed to load posts');
            }
          } else {
            setError(err?.message ?? 'Failed to load more posts');
          }
        }
      }

      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    },
    [loadFromCache, persistToCache],
  );

  // ── Mount: show cache instantly, then attempt a live refresh ───────────────
  useEffect(() => {
    const init = async () => {
      const cached = await loadFromCache();
      if (cached.length > 0) setPosts(cached); // instant display
      await loadPage(1, true);
    };
    init();

    // Subscribe to connectivity changes while the screen is mounted
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = !!state.isConnected && !!state.isInternetReachable;
      setIsOffline(!online);
      if (online) {
        // Came back online — silently refresh page 1
        pageRef.current = 1;
        loadPage(1, true);
      }
    });

    return unsubscribe; // cleanup listener on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = useCallback(() => {
    pageRef.current = 1;
    setHasMore(true);
    loadPage(1, true);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading || isOffline) return;
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    loadPage(nextPage, false);
  }, [hasMore, loadingMore, loading, isOffline, loadPage]);

  return { posts, loading, loadingMore, error, hasMore, isOffline, refetch, loadMore };
};

// ─── Single Post Hook ─────────────────────────────────────────────────────────
export const usePost = (postId: number) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPost = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pageNumber = Math.ceil(postId / PAGE_SIZE);
      const posts = await fetchPosts(pageNumber);
      const found = posts.find((p) => p.id === postId);
      if (!found) throw new Error('Post not found');

      const comments = await fetchComments(postId);
      setPost({ ...found, comments });
    } catch (err: any) {
      setError(err?.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const likePost = useCallback(() => {
    setPost((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
  }, []);

  const addComment = useCallback((comment: Omit<Comment, 'id' | 'postId'>) => {
    setPost((prev) => {
      if (!prev) return null;
      const newComment: Comment = {
        ...comment,
        id: Date.now(),
        postId: prev.id,
      };
      return { ...prev, comments: [...prev.comments, newComment] };
    });
  }, []);

  return { post, loading, error, likePost, addComment, refetch: loadPost };
};