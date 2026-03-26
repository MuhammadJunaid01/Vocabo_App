import { Comment, Post } from '../../core/types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
const PAGE_SIZE = 10;

export const fetchPosts = async (page: number = 1): Promise<Post[]> => {
  const start = (page - 1) * PAGE_SIZE;
  const response = await fetch(`${BASE_URL}/posts?_start=${start}&_limit=${PAGE_SIZE}`);
  if (!response.ok) throw new Error('Failed to fetch posts');
  const posts = await response.json();
  return posts.map((post: any) => ({
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

export { PAGE_SIZE };