import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
import { FieldErrors, validateSignupForm } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export function SignupScreen({ navigation }: Props) {
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const runValidation = (n = name, e = email, p = password) => validateSignupForm(n, e, p);

  const handleSignup = async () => {
    const validation = runValidation();
    setErrors(validation);
    setTouched({ name: true, email: true, password: true });

    if (Object.keys(validation).length > 0) return;

    try {
      await signup(name, email, password);
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : 'Sign up failed. Please try again.',
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
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </Pressable>
            <Text style={styles.heading}>Create account</Text>
            <Text style={styles.subheading}>
              Join Smart Ingredient and never waste food again
            </Text>
          </View>

          <View style={styles.form}>
            {errors.form ? (
              <View style={styles.formError}>
                <Ionicons name="alert-circle" size={18} color={colors.error} />
                <Text style={styles.formErrorText}>{errors.form}</Text>
              </View>
            ) : null}

            <Input
              label="Full name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (touched.name) {
                  setErrors((prev) => ({
                    ...prev,
                    name: runValidation(text, email, password).name,
                    form: undefined,
                  }));
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, name: true }));
                setErrors((prev) => ({ ...prev, name: runValidation().name }));
              }}
              placeholder="Your name"
              autoCapitalize="words"
              error={touched.name ? errors.name : undefined}
            />
            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (touched.email) {
                  setErrors((prev) => ({
                    ...prev,
                    email: runValidation(name, text, password).email,
                    form: undefined,
                  }));
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, email: true }));
                setErrors((prev) => ({ ...prev, email: runValidation().email }));
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
                    password: runValidation(name, email, text).password,
                    form: undefined,
                  }));
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, password: true }));
                setErrors((prev) => ({ ...prev, password: runValidation().password }));
              }}
              placeholder="At least 6 characters"
              secureTextEntry
              error={touched.password ? errors.password : undefined}
            />

            <Button
              label="Create Account"
              onPress={handleSignup}
              loading={isLoading}
              style={styles.submit}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Sign in</Text>
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
  scroll: { flexGrow: 1, padding: spacing.lg },
  header: {
    marginBottom: spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subheading: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  form: {
    gap: spacing.md,
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
