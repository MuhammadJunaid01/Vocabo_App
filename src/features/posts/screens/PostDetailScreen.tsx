import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card } from '../../../shared/components/Card';
import { useAuth } from '../../auth/hooks';
import { usePost } from '../hooks';
import Icon from 'react-native-vector-icons/Ionicons';

export const PostDetailScreen: React.FC = () => {
  const route = useRoute();
  const { postId } = route.params as { postId: number };
  const { post, loading, error, likePost, addComment, refetch } = usePost(postId);
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading post…</Text>
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorTitle}>{error || 'Post not found'}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment({
      name: user?.displayName || 'You',
      email: user?.email || 'anon@example.com',
      body: commentText.trim(),
    });
    setCommentText('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Post Content */}
      <Card style={styles.postCard}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postBody}>{post.body}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBadge}>
            <Icon name="heart" size={15} color="#FF3B30" />
            <Text style={styles.statText}>{post.likes} likes</Text>
          </View>
          <View style={[styles.statBadge, styles.commentStat]}>
            <Icon name="chatbubble" size={14} color="#007AFF" />
            <Text style={[styles.statText, styles.commentStatText]}>{post.comments.length} comments</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.likeButton} onPress={likePost}>
          <Icon name="heart-outline" size={18} color="#fff" />
          <Text style={styles.likeButtonText}>Like this post</Text>
        </TouchableOpacity>
      </Card>

      {/* Comments Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comments</Text>
        {post.comments.length === 0 && (
          <Text style={styles.emptyComments}>No comments yet. Be the first!</Text>
        )}
        {post.comments.map((comment) => (
          <Card key={comment.id} style={styles.commentCard}>
            <Text style={styles.commentName}>{comment.name}</Text>
            <Text style={styles.commentEmail}>{comment.email}</Text>
            <Text style={styles.commentBody}>{comment.body}</Text>
          </Card>
        ))}
      </View>

      {/* Add Comment */}
      <Card style={styles.addCommentCard}>
        <Text style={styles.addCommentLabel}>Add a comment</Text>
        <TextInput
          style={styles.input}
          placeholder="Share your thoughts…"
          placeholderTextColor="#AEAEB2"
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity
          style={[styles.postBtn, !commentText.trim() && styles.postBtnDisabled]}
          onPress={handleAddComment}
          disabled={!commentText.trim()}
        >
          <Text style={styles.postBtnText}>Post Comment</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    marginTop: 12,
    color: '#8E8E93',
    fontSize: 15,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  postCard: {
    marginBottom: 20,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 14,
    lineHeight: 30,
    letterSpacing: -0.3,
    textTransform: 'capitalize',
  },
  postBody: {
    fontSize: 16,
    lineHeight: 26,
    color: '#3C3C43',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  commentStat: {
    backgroundColor: '#E5F3FF',
  },
  statText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 14,
  },
  commentStatText: {
    color: '#007AFF',
  },
  likeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF3B30',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  likeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  emptyComments: {
    color: '#8E8E93',
    fontSize: 15,
    marginBottom: 12,
    textAlign: 'center',
  },
  commentCard: {
    marginBottom: 12,
  },
  commentName: {
    fontWeight: '700',
    color: '#1C1C1E',
    fontSize: 15,
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  commentEmail: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
  },
  commentBody: {
    color: '#3C3C43',
    lineHeight: 22,
  },
  addCommentCard: {
    marginTop: 8,
  },
  addCommentLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 14,
    minHeight: 90,
    marginBottom: 12,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#1C1C1E',
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
  },
  postBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  postBtnDisabled: {
    backgroundColor: '#C7C7CC',
    shadowOpacity: 0,
    elevation: 0,
  },
  postBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});