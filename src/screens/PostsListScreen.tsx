// src/features/posts/screens/PostsListScreen.tsx
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { PostCard } from '../components/PostCard';
import { useAuth } from '../features/auth/hooks';
import { usePosts } from '../features/posts/hooks';
import { Button } from '../shared/components/Button';

export const PostsListScreen: React.FC = () => {
  const { posts, loading, error, refetch } = usePosts();
  const { logout } = useAuth();
  const navigation = useNavigation<any>();

  const handlePress = (postId: number) => {
    navigation.navigate('PostDetail', { postId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Posts</Text>
        <Button title="Logout" variant="danger" onPress={logout} />
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Button title="Retry" onPress={refetch} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard post={item} onPress={() => handlePress(item.id)} />
          )}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  error: {
    color: '#FF3B30',
    marginBottom: 16,
  },
});