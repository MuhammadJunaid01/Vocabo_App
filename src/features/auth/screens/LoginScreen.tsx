import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../hooks';

// ─── Sub-components ────────────────────────────────────────────────────────────

const AuthInput: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
}> = ({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize }) => (
  <View style={inputStyles.wrapper}>
    <Text style={inputStyles.label}>{label}</Text>
    <TextInput
      style={inputStyles.field}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize ?? 'none'}
    />
  </View>
);

const inputStyles = StyleSheet.create({
  wrapper: { marginBottom: 18 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  field: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
});

// ─── Main Screen ───────────────────────────────────────────────────────────────

export const LoginScreen: React.FC = () => {
  const { login, register, googleLogin, loading, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const switchMode = (toLogin: boolean) => {
    clearError();
    setIsLogin(toLogin);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = () => {
    clearError();
    (isLogin ? login : register)(email, password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <View style={styles.hero}>
          <View style={styles.logoRing}>
            <Text style={styles.logoEmoji}>📚</Text>
          </View>
          <Text style={styles.brand}>Vocabo</Text>
          <Text style={styles.heroSub}>Your personal reading hub</Text>
        </View>

        {/* ── Card ─────────────────────────────────────────────────────── */}
        <View style={styles.card}>

          {/* Tab switcher */}
          <View style={styles.tabBar}>
            <Pressable
              style={[styles.tab, isLogin && styles.tabActive]}
              onPress={() => switchMode(true)}>
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Sign In</Text>
            </Pressable>
            <Pressable
              style={[styles.tab, !isLogin && styles.tabActive]}
              onPress={() => switchMode(false)}>
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Register</Text>
            </Pressable>
          </View>

          {/* Inputs */}
          <AuthInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <AuthInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️  {error}</Text>
            </View>
          ) : null}

          {/* Primary CTA */}
          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>or continue with</Text>
            <View style={styles.divLine} />
          </View>

          {/* Google */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={googleLogin}
            disabled={loading}
            activeOpacity={0.85}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity>
        </View>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
          </Text>
          <Text style={styles.footerLink} onPress={() => switchMode(!isLogin)}>
            {isLogin ? 'Register' : 'Sign In'}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const BLUE = '#2563EB';
const BLUE_LIGHT = '#EFF6FF';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 40,
  },

  // ── Hero ──────────────────────────────────────────────────────────────
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoRing: {
    width: 88,
    height: 88,
    borderRadius: 26,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },
  logoEmoji: { fontSize: 40 },
  brand: {
    fontSize: 34,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -1,
  },
  heroSub: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
  },

  // ── Card ──────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.07,
    shadowRadius: 28,
    elevation: 8,
  },

  // Tab switcher
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 28,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#111827',
  },

  // Error
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '500',
  },

  // Primary button
  primaryBtn: {
    backgroundColor: BLUE,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  divText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  // Google button
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4285F4',
    fontStyle: 'italic',
  },
  googleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
    color: '#6B7280',
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '700',
    color: BLUE,
  },
});