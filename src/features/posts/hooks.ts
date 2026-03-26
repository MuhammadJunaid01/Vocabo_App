import { useCallback, useEffect, useRef, useState } from 'react';
import { storage } from '../../core/utils/storage';
import { Comment, Post } from '../../core/types';
import { fetchComments, fetchPosts, PAGE_SIZE } from './api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ─── Paginated Posts Hook (Infinite Scroll) ───────────────────────────────────
export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const lastFetch = useRef<number>(0);
  const isFetchingRef = useRef(false); // guard against duplicate calls

  const loadPage = useCallback(async (page: number, isRefresh: boolean) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    isRefresh ? setLoading(true) : setLoadingMore(true);
    setError(null);

    try {
      const data = await fetchPosts(page);
      setPosts((prev) => (isRefresh ? data : [...prev, ...data]));
      lastFetch.current = Date.now();
      setHasMore(data.length === PAGE_SIZE);

      // Cache only the first page for offline use
      if (isRefresh) {
        await storage.setItem(storage.KEYS.POSTS, data);
      }
    } catch (err: any) {
      if (isRefresh) {
        // Fall back to offline cache on initial load failure
        const cachedData = await storage.getItem(storage.KEYS.POSTS);
        if (cachedData) {
          setPosts(cachedData);
          setHasMore(false);
          setError('Working offline. Data may be outdated.');
        } else {
          setError(err?.message || 'Failed to load posts');
        }
      } else {
        setError(err?.message || 'Failed to load more posts');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      // Show cached data immediately for snappy UX
      const cachedData = await storage.getItem(storage.KEYS.POSTS);
      if (cachedData) setPosts(cachedData);
      await loadPage(1, true);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = useCallback(() => {
    pageRef.current = 1;
    setHasMore(true);
    loadPage(1, true);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading) return;
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    loadPage(nextPage, false);
  }, [hasMore, loadingMore, loading, loadPage]);

  return { posts, loading, loadingMore, error, hasMore, refetch, loadMore };
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
      // Fetch the specific page containing this post (posts are id 1-100)
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