export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}