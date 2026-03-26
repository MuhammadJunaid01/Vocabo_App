import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Post } from '../../../core/types';
import { Card } from '../../../shared/components/Card';
import Icon from 'react-native-vector-icons/Ionicons';

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
      <Card style={styles.card}>
        <Text style={styles.title} numberOfLines={1}>
          {post.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {post.body}
        </Text>
        <View style={styles.footer}>
          <View style={styles.badge}>
            <Icon name="heart" size={14} color="#FF3B30" />
            <Text style={styles.badgeText}>{post.likes}</Text>
          </View>
          <View style={[styles.badge, styles.commentBadge]}>
            <Icon name="chatbubble" size={13} color="#007AFF" />
            <Text style={styles.commentBadgeText}>{post.comments.length}</Text>
          </View>
          <Text style={styles.readMore}>Read more →</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1C1C1E',
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    color: '#6C6C70',
    marginBottom: 16,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '600',
  },
  commentBadge: {
    backgroundColor: '#E5F3FF',
  },
  commentBadgeText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '600',
  },
  readMore: {
    marginLeft: 'auto',
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '600',
  },
});