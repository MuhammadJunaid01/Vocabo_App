import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useAuth } from '../features/auth/hooks';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { PostDetailScreen } from '../features/posts/screens/PostDetailScreen';
import { PostsListScreen } from '../features/posts/screens/PostsListScreen';

export type RootStackParamList = {
  Login: undefined;
  PostsList: undefined;
  PostDetail: { postId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();


  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="PostsList" component={PostsListScreen} />
            <Stack.Screen
              name="PostDetail"
              component={PostDetailScreen}
              options={{ headerShown: true, title: 'Post' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};