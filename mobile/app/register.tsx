import { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { router } from 'expo-router';
import { register, login } from '../services/auth';
import { useAuthStore } from '../store/authStore';

// 主题颜色
const PRIMARY_COLOR = '#8fd460';
const BACKGROUND_LIGHT = '#f8fbf6';
const TEXT_PRIMARY = '#2c3e2d';
const TEXT_SECONDARY = '#6b7c6d';
const ERROR_COLOR = '#e57373';

/**
 * 注册表单数据
 */
interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { login: setAuth } = useAuthStore();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // 监听密码字段，用于确认密码验证
  const password = watch('password');

  /**
   * 验证邮箱格式
   */
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || '请输入有效的邮箱地址';
  };

  /**
   * 验证密码匹配
   */
  const validatePasswordMatch = (value: string) => {
    return value === password || '两次输入的密码不一致';
  };

  /**
   * 处理注册提交
   */
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setApiError(null);

      // 1. 调用注册 API
      await register({
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
      });

      // 2. 注册成功后，自动登录
      try {
        const loginResponse = await login({
          usernameOrEmail: data.username.trim(),
          password: data.password,
        });

        // 3. 登录成功，更新 authStore
        setAuth(loginResponse.user, loginResponse.accessToken);

        // 4. 跳转到主页
        router.replace('/');
      } catch (loginError: any) {
        // 自动登录失败，跳转到登录页（让用户手动登录）
        // 这种情况很少发生，但为了健壮性还是处理一下
        router.replace('/login');
      }
    } catch (error: any) {
      // 显示友好的错误消息
      setApiError(error.message || '注册失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.header}>
            <Text variant="displaySmall" style={styles.title}>
              创建账户
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              填写信息以注册新账户
            </Text>
          </View>

          {/* 用户名输入框 */}
          <Controller
            control={control}
            name="username"
            rules={{
              required: '请输入用户名',
              minLength: {
                value: 3,
                message: '用户名至少需要 3 个字符',
              },
              maxLength: {
                value: 50,
                message: '用户名不能超过 50 个字符',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="用户名"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="username"
                  error={!!errors.username}
                  disabled={isLoading}
                  outlineColor={errors.username ? ERROR_COLOR : '#e0e0e0'}
                  activeOutlineColor={PRIMARY_COLOR}
                  style={styles.input}
                  contentStyle={styles.inputContent}
                />
                {errors.username && (
                  <HelperText type="error" visible={!!errors.username}>
                    {errors.username.message}
                  </HelperText>
                )}
              </View>
            )}
          />

          {/* 邮箱输入框 */}
          <Controller
            control={control}
            name="email"
            rules={{
              required: '请输入邮箱',
              validate: validateEmail,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="邮箱"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  error={!!errors.email}
                  disabled={isLoading}
                  outlineColor={errors.email ? ERROR_COLOR : '#e0e0e0'}
                  activeOutlineColor={PRIMARY_COLOR}
                  style={styles.input}
                  contentStyle={styles.inputContent}
                />
                {errors.email && (
                  <HelperText type="error" visible={!!errors.email}>
                    {errors.email.message}
                  </HelperText>
                )}
              </View>
            )}
          />

          {/* 密码输入框 */}
          <Controller
            control={control}
            name="password"
            rules={{
              required: '请输入密码',
              minLength: {
                value: 6,
                message: '密码至少需要 6 个字符',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="密码"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  error={!!errors.password}
                  disabled={isLoading}
                  outlineColor={errors.password ? ERROR_COLOR : '#e0e0e0'}
                  activeOutlineColor={PRIMARY_COLOR}
                  style={styles.input}
                  contentStyle={styles.inputContent}
                />
                {errors.password && (
                  <HelperText type="error" visible={!!errors.password}>
                    {errors.password.message}
                  </HelperText>
                )}
              </View>
            )}
          />

          {/* 确认密码输入框 */}
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: '请确认密码',
              validate: validatePasswordMatch,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="确认密码"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  error={!!errors.confirmPassword}
                  disabled={isLoading}
                  outlineColor={errors.confirmPassword ? ERROR_COLOR : '#e0e0e0'}
                  activeOutlineColor={PRIMARY_COLOR}
                  style={styles.input}
                  contentStyle={styles.inputContent}
                />
                {errors.confirmPassword && (
                  <HelperText type="error" visible={!!errors.confirmPassword}>
                    {errors.confirmPassword.message}
                  </HelperText>
                )}
              </View>
            )}
          />

          {/* API 错误提示 */}
          {apiError && (
            <HelperText type="error" visible={!!apiError} style={styles.apiError}>
              {apiError}
            </HelperText>
          )}

          {/* 注册按钮 */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            buttonColor={PRIMARY_COLOR}
            textColor="#fff"
          >
            {isLoading ? '注册中...' : '注册'}
          </Button>

          {/* 登录链接 */}
          <View style={styles.footer}>
            <Text variant="bodyMedium" style={styles.footerText}>
              已有账户？{' '}
              <Text
                style={styles.link}
                onPress={() => router.push('/login')}
              >
                立即登录
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_LIGHT,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
  },
  form: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  subtitle: {
    textAlign: 'center',
    color: TEXT_SECONDARY,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputContent: {
    fontSize: 16,
  },
  apiError: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 4,
  },
  button: {
    marginTop: 12,
    borderRadius: 12,
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: TEXT_SECONDARY,
  },
  link: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
});

