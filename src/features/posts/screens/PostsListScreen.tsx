import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Post } from '../../../core/types';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useAuth } from '../../auth/hooks';
import { PostCard } from '../components/PostCard';
import { usePosts } from '../hooks';

export const PostsListScreen: React.FC = () => {
  const { posts, loading, loadingMore, error, hasMore, refetch, loadMore } = usePosts();
  const { logout, user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const handlePress = useCallback(
    (postId: number) => navigation.navigate('PostDetail', { postId }),
    [navigation],
  );

  // Memoized render item for FlatList performance
  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard post={item} onPress={() => handlePress(item.id)} />
    ),
    [handlePress],
  );

  const keyExtractor = useCallback((item: Post) => item.id.toString(), []);

  const ListFooterComponent = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.footerText}>Loading more…</Text>
      </View>
    );
  }, [loadingMore]);

  const ListEmptyComponent = useCallback(() => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📭</Text>
        <Text style={styles.emptyText}>No posts available</Text>
      </View>
    );
  }, [loading]);

  if (error && posts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.appHeader, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.appTitle}>📚 Vocabo</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Text style={styles.errorEmoji}>📡</Text>
          <Text style={styles.errorTitle}>No Connection</Text>
          <Text style={styles.errorMsg}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* App Header */}
      <View style={[styles.appHeader, { paddingTop: insets.top + 20 }]}>
        <View>
          <Text style={styles.appTitle}>📚 Vocabo</Text>
          {user?.displayName && (
            <Text style={styles.welcomeText}>Hi, {user.displayName.split(' ')[0]}!</Text>
          )}
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Offline Banner */}
      {error && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>📡 Working offline – showing cached data</Text>
        </View>
      )}

      {/* Initial Load Spinner */}
      {loading && posts.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading posts…</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={hasMore ? loadMore : undefined}
          onEndReachedThreshold={0.4}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} tintColor="#007AFF" />
          }
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          initialNumToRender={6}
          windowSize={11}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  welcomeText: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 14,
  },
  offlineBanner: {
    backgroundColor: '#FFF9E6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE58A',
  },
  offlineBannerText: {
    color: '#946200',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  footerText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  errorMsg: {
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 15,
  },
  retryBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  loadingText: {
    marginTop: 12,
    color: '#8E8E93',
    fontSize: 15,
  },
});