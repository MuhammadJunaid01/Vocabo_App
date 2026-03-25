import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { usePost } from '../features/posts/hooks';
import { Button } from '../shared/components/Button';
import { Card } from '../shared/components/Card';

export const PostDetailScreen: React.FC = () => {
  const route = useRoute();
  const { postId } = route.params as { postId: number };
  const { post, loading, error, likePost, addComment, refetch } = usePost(postId);
  const [commentText, setCommentText] = useState('');

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || 'Post not found'}</Text>
        <Button title="Retry" onPress={refetch} />
      </View>
    );
  }

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment({
      name: 'Anonymous',
      email: 'anon@example.com',
      body: commentText.trim(),
    });
    setCommentText('');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.postCard}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postBody}>{post.body}</Text>
        <View style={styles.actions}>
          <Button
            title={`♥ Like (${post.likes})`}
            variant="secondary"
            onPress={likePost}
          />
        </View>
      </Card>

      <View style={styles.commentsSection}>
        <Text style={styles.sectionTitle}>Comments ({post.comments.length})</Text>
        
        {post.comments.map((comment) => (
          <Card key={comment.id} style={styles.commentCard}>
            <Text style={styles.commentName}>{comment.name}</Text>
            <Text style={styles.commentBody}>{comment.body}</Text>
          </Card>
        ))}

        <Card style={styles.addCommentCard}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <Button
            title="Post Comment"
            onPress={handleAddComment}
            disabled={!commentText.trim()}
          />
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postCard: {
    margin: 16,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  postBody: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  actions: {
    marginTop: 16,
  },
  commentsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  commentCard: {
    marginBottom: 8,
  },
  commentName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  commentBody: {
    color: '#666',
  },
  addCommentCard: {
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    minHeight: 80,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  error: {
    color: '#FF3B30',
    marginBottom: 16,
  },
});