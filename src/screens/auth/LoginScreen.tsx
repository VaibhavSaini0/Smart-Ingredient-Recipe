import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { colors, radius, spacing } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { AuthStackParamList } from '../../navigation/types';
import { FieldErrors, validateLoginForm } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleLogin = async () => {
    const validation = validateLoginForm(email, password);
    setErrors(validation);
    setTouched({ email: true, password: true });

    if (Object.keys(validation).length > 0) return;

    try {
      await login(email, password);
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : 'Login failed. Please try again.',
      });
    }
  };

  return (
    <ScreenWrapper showActiveBar={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient colors={['#E85D04', '#F48C06']} style={styles.hero}>
            <View style={styles.logoCircle}>
              <Ionicons name="restaurant" size={36} color={colors.primary} />
            </View>
            <Text style={styles.brand}>Smart Ingredient</Text>
            <Text style={styles.tagline}>
              Turn what you have into something delicious
            </Text>
          </LinearGradient>

          <View style={styles.form}>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.subheading}>Sign in to start cooking smarter</Text>

            {errors.form ? (
              <View style={styles.formError}>
                <Ionicons name="alert-circle" size={18} color={colors.error} />
                <Text style={styles.formErrorText}>{errors.form}</Text>
              </View>
            ) : null}

            <View style={styles.fields}>
              <Input
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (touched.email) {
                    setErrors((prev) => ({
                      ...prev,
                      email: validateLoginForm(text, password).email,
                      form: undefined,
                    }));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, email: true }));
                  setErrors((prev) => ({
                    ...prev,
                    email: validateLoginForm(email, password).email,
                  }));
                }}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={touched.email ? errors.email : undefined}
              />
              <Input
                label="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (touched.password) {
                    setErrors((prev) => ({
                      ...prev,
                      password: validateLoginForm(email, text).password,
                      form: undefined,
                    }));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, password: true }));
                  setErrors((prev) => ({
                    ...prev,
                    password: validateLoginForm(email, password).password,
                  }));
                }}
                placeholder="Enter your password"
                secureTextEntry
                error={touched.password ? errors.password : undefined}
              />
            </View>

            <Button
              label="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.submit}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>New here?</Text>
              <Pressable onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.link}>Create an account</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  hero: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl * 1.5,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  form: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  subheading: {
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  formError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FEF2F2',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  formErrorText: {
    flex: 1,
    color: colors.error,
    fontSize: 14,
    lineHeight: 20,
  },
  fields: {
    gap: spacing.md,
  },
  submit: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  link: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
