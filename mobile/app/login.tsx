import { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { login } from '../services/auth';
import { useAuthStore } from '../store/authStore';

// 主题颜色
const PRIMARY_COLOR = '#8fd460';
const BACKGROUND_LIGHT = '#f8fbf6';
const TEXT_PRIMARY = '#2c3e2d';
const TEXT_SECONDARY = '#6b7c6d';
const ERROR_COLOR = '#e57373';

/**
 * 登录表单数据
 */
interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { login: setAuth } = useAuthStore();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  /**
   * 验证邮箱格式
   */
  const validateEmail = (value: string) => {
    // 如果输入包含 @，则验证邮箱格式
    if (value.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) || '请输入有效的邮箱地址';
    }
    return true;
  };

  /**
   * 处理登录提交
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setApiError(null);

      const response = await login({
        usernameOrEmail: data.usernameOrEmail.trim(),
        password: data.password,
      });

      // 登录成功，更新 authStore
      setAuth(response.user, response.accessToken);

      // 导航到指定页面或主页
      const targetPath = returnTo && typeof returnTo === 'string' ? returnTo : '/';
      router.replace(targetPath as any);
    } catch (error: any) {
      // 显示友好的错误消息
      setApiError(error.message || '登录失败，请稍后重试');
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
              欢迎回来
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              登录您的账户以继续
            </Text>
          </View>

          {/* 用户名/邮箱输入框 */}
          <Controller
            control={control}
            name="usernameOrEmail"
            rules={{
              required: '请输入用户名或邮箱',
              validate: validateEmail,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  label="用户名或邮箱"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="username"
                  error={!!errors.usernameOrEmail}
                  disabled={isLoading}
                  outlineColor={errors.usernameOrEmail ? ERROR_COLOR : '#e0e0e0'}
                  activeOutlineColor={PRIMARY_COLOR}
                  style={styles.input}
                  contentStyle={styles.inputContent}
                />
                {errors.usernameOrEmail && (
                  <HelperText type="error" visible={!!errors.usernameOrEmail}>
                    {errors.usernameOrEmail.message}
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
                  textContentType="password"
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

          {/* API 错误提示 */}
          {apiError && (
            <HelperText type="error" visible={!!apiError} style={styles.apiError}>
              {apiError}
            </HelperText>
          )}

          {/* 登录按钮 */}
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
            {isLoading ? '登录中...' : '登录'}
          </Button>
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
});
