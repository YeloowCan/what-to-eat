import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ActivityIndicator, Button } from 'react-native-paper';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useUser } from '../hooks/useUser';
import { router } from 'expo-router';

// 主题颜色
const PRIMARY_COLOR = '#8fd460';
const BACKGROUND_LIGHT = '#f8fbf6';
const TEXT_PRIMARY = '#2c3e2d';
const TEXT_SECONDARY = '#6b7c6d';

/**
 * 骨架屏组件
 */
function SkeletonLoader() {
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonCard}>
        <View style={styles.skeletonHeader}>
          <View style={[styles.skeletonCircle, { width: 80, height: 80, borderRadius: 40 }]} />
          <View style={styles.skeletonTextContainer}>
            <View style={[styles.skeletonLine, { width: 150, height: 20, marginBottom: 8 }]} />
            <View style={[styles.skeletonLine, { width: 200, height: 16 }]} />
          </View>
        </View>
        <View style={styles.skeletonContent}>
          <View style={[styles.skeletonLine, { width: '100%', height: 16, marginBottom: 12 }]} />
          <View style={[styles.skeletonLine, { width: '80%', height: 16, marginBottom: 12 }]} />
          <View style={[styles.skeletonLine, { width: '90%', height: 16 }]} />
        </View>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  // 应用路由守卫：未认证时自动重定向到登录页
  const isAuthenticated = useAuthGuard();

  // 获取用户信息
  const { data: user, isLoading, error } = useUser();

  // 如果未认证，useAuthGuard 会重定向，这里不会渲染
  if (!isAuthenticated) {
    return null;
  }

  // 加载状态：显示骨架屏
  if (isLoading) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <SkeletonLoader />
      </ScrollView>
    );
  }

  // 错误状态：显示友好错误信息
  if (error) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.errorTitle}>
              获取用户信息失败
            </Text>
            <Text variant="bodyMedium" style={styles.errorMessage}>
              {error instanceof Error ? error.message : '网络错误，请稍后重试'}
            </Text>
            <Button
              mode="contained"
              onPress={() => router.replace('/')}
              style={styles.errorButton}
              buttonColor={PRIMARY_COLOR}
            >
              返回首页
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  // 用户信息不存在
  if (!user) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.errorTitle}>
              用户信息不存在
            </Text>
            <Button
              mode="contained"
              onPress={() => router.replace('/')}
              style={styles.errorButton}
              buttonColor={PRIMARY_COLOR}
            >
              返回首页
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  // 显示用户信息
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text variant="headlineMedium" style={styles.avatarText}>
                {user.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text variant="headlineSmall" style={styles.username}>
                {user.username}
              </Text>
              <Text variant="bodyMedium" style={styles.email}>
                {user.email}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* 用户资料 */}
      {user.profile && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              个人资料
            </Text>
            <View style={styles.profileItem}>
              <Text variant="bodyMedium" style={styles.profileLabel}>
                身高
              </Text>
              <Text variant="bodyLarge" style={styles.profileValue}>
                {user.profile.height ? `${user.profile.height} cm` : '未设置'}
              </Text>
            </View>
            <View style={styles.profileItem}>
              <Text variant="bodyMedium" style={styles.profileLabel}>
                体重
              </Text>
              <Text variant="bodyLarge" style={styles.profileValue}>
                {user.profile.weight ? `${user.profile.weight} kg` : '未设置'}
              </Text>
            </View>
            <View style={styles.profileItem}>
              <Text variant="bodyMedium" style={styles.profileLabel}>
                年龄
              </Text>
              <Text variant="bodyLarge" style={styles.profileValue}>
                {user.profile.age ? `${user.profile.age} 岁` : '未设置'}
              </Text>
            </View>
            <View style={styles.profileItem}>
              <Text variant="bodyMedium" style={styles.profileLabel}>
                性别
              </Text>
              <Text variant="bodyLarge" style={styles.profileValue}>
                {user.profile.gender === 'male' ? '男' : user.profile.gender === 'female' ? '女' : '未设置'}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* 无用户资料时显示提示 */}
      {!user.profile && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.emptyProfileText}>
              暂无个人资料，请完善您的信息
            </Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_LIGHT,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  email: {
    color: TEXT_SECONDARY,
  },
  sectionTitle: {
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileLabel: {
    color: TEXT_SECONDARY,
  },
  profileValue: {
    fontWeight: '500',
    color: TEXT_PRIMARY,
  },
  emptyProfileText: {
    textAlign: 'center',
    color: TEXT_SECONDARY,
    paddingVertical: 20,
  },
  // 骨架屏样式
  skeletonContainer: {
    padding: 16,
  },
  skeletonCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  skeletonTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  skeletonLine: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonCircle: {
    backgroundColor: '#e0e0e0',
  },
  skeletonContent: {
    marginTop: 20,
  },
  // 错误状态样式
  errorTitle: {
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    color: TEXT_SECONDARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 8,
  },
});

