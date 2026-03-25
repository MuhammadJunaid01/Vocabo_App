import { useCallback, useEffect, useRef, useState } from 'react';
import { Comment, Post } from '../../core/types';
import { fetchComments, fetchPosts } from './api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetch = useRef<number>(0);

  const loadPosts = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && now - lastFetch.current < CACHE_DURATION && posts.length > 0) {
      return; // Use cache
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchPosts();
      setPosts(data);
      lastFetch.current = now;
    } catch (err: any) {
      setError(err?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [posts.length]);

  useEffect(() => {
    loadPosts();
  }, []);

  const refetch = useCallback(() => loadPosts(true), [loadPosts]);

  return { posts, loading, error, refetch };
};

export const usePost = (postId: number) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPost = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const posts = await fetchPosts();
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