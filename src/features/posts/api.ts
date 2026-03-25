import { Comment, Post } from '../../core/types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${BASE_URL}/posts`);
  if (!response.ok) throw new Error('Failed to fetch posts');
  const posts = await response.json();
  return posts.slice(0, 20).map((post: any) => ({
    ...post,
    likes: 0,
    comments: [],
  }));
};

export const fetchComments = async (postId: number): Promise<Comment[]> => {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
  if (!response.ok) throw new Error('Failed to fetch comments');
  return response.json();
};