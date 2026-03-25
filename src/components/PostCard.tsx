import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Post } from '../core/types';
import { Card } from '../shared/components/Card';

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.body} numberOfLines={3}>
          {post.body}
        </Text>
        <Text style={styles.meta}>
          ♥ {post.likes}    💬 {post.comments.length}
        </Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: '#999',
  },
});