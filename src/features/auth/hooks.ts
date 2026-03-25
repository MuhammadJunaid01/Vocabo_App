import { useCallback, useEffect, useState } from 'react';
import { User } from '../../core/types';
import {
    loginWithEmail,
    loginWithGoogle,
    logoutUser,
    registerWithEmail,
    subscribeToAuth,
} from './api';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setState({ user, loading: false, error: null });
    });
    return unsubscribe;
  }, []);

  const handleAuth = useCallback(
    async (authFunction: () => Promise<User>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const user = await authFunction();
        setState({ user, loading: false, error: null });
      } catch (error: any) {
        setState({
          user: null,
          loading: false,
          error: error?.message || 'Authentication failed',
        });
      }
    },
    []
  );

  const login = useCallback(
    (email: string, password: string) =>
      handleAuth(() => loginWithEmail(email, password)),
    [handleAuth]
  );

  const register = useCallback(
    (email: string, password: string) =>
      handleAuth(() => registerWithEmail(email, password)),
    [handleAuth]
  );

  const googleLogin = useCallback(() => handleAuth(loginWithGoogle), [handleAuth]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
      setState({ user: null, loading: false, error: null });
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error?.message || 'Logout failed' }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    register,
    googleLogin,
    logout,
    clearError,
  };
};