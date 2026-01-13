import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  ActivityIndicator,
  Button,
  Chip,
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { getRandomDish } from '../services/dishes';
import { useAuthGuard } from '../hooks/useAuthGuard';
import type { Dish } from '../types/dish';

// 主题颜色
const PRIMARY_COLOR = '#8fd460';
const BACKGROUND_LIGHT = '#f8fbf6';
const TEXT_PRIMARY = '#2c3e2d';
const TEXT_SECONDARY = '#6b7c6d';
const ERROR_COLOR = '#e57373';

/**
 * 骨架屏组件
 */
function SkeletonLoader() {
  return (
    <View style={styles.skeletonContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.skeletonHeader}>
            <View style={[styles.skeletonLine, { width: 200, height: 28, marginBottom: 16 }]} />
          </View>
          <View style={styles.skeletonContent}>
            <View style={[styles.skeletonLine, { width: 100, height: 20, marginBottom: 12 }]} />
            <View style={[styles.skeletonLine, { width: '100%', height: 16, marginBottom: 8 }]} />
            <View style={[styles.skeletonLine, { width: '90%', height: 16, marginBottom: 8 }]} />
            <View style={[styles.skeletonLine, { width: '80%', height: 16, marginBottom: 16 }]} />
            <View style={styles.skeletonTags}>
              <View style={[styles.skeletonChip, { width: 60, height: 32 }]} />
              <View style={[styles.skeletonChip, { width: 60, height: 32 }]} />
            </View>
            <View style={[styles.skeletonLine, { width: 120, height: 16, marginTop: 16 }]} />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

/**
 * 推荐页面组件
 */
export default function RecommendScreen() {
  // 应用路由守卫：未认证时自动重定向到登录页
  const isAuthenticated = useAuthGuard();

  // 获取随机推荐菜品
  const {
    data: dish,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<Dish>({
    queryKey: ['dishes', 'random'],
    queryFn: getRandomDish,
    staleTime: 0, // 每次都需要获取新的推荐
    retry: 1, // 失败时重试 1 次
  });

  // 如果未认证，useAuthGuard 会重定向，这里不会渲染
  if (!isAuthenticated) {
    return null;
  }

  // 加载状态：显示骨架屏
  if (isLoading) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <SkeletonLoader />
      </ScrollView>
    );
  }

  // 错误状态：显示友好错误信息
  if (error) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.errorTitle}>
              获取推荐失败
            </Text>
            <Text variant="bodyMedium" style={styles.errorMessage}>
              {error instanceof Error
                ? error.message
                : '网络错误，请稍后重试'}
            </Text>
            <Button
              mode="contained"
              onPress={() => refetch()}
              style={styles.errorButton}
              buttonColor={PRIMARY_COLOR}
            >
              重试
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  // 菜品不存在
  if (!dish) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.errorTitle}>
              暂无推荐
            </Text>
            <Text variant="bodyMedium" style={styles.errorMessage}>
              数据库中暂无菜品，请先添加菜品数据
            </Text>
            <Button
              mode="contained"
              onPress={() => refetch()}
              style={styles.errorButton}
              buttonColor={PRIMARY_COLOR}
            >
              重试
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Card style={styles.card}>
        <Card.Content>
          {/* 菜品名称 */}
          <Text variant="headlineMedium" style={styles.dishName}>
            {dish.name}
          </Text>

          {/* 分类和菜系 */}
          <View style={styles.metaContainer}>
            {dish.category && (
              <Chip style={styles.chip} textStyle={styles.chipText}>
                {dish.category}
              </Chip>
            )}
            {dish.cuisineType && (
              <Chip style={styles.chip} textStyle={styles.chipText}>
                {dish.cuisineType}
              </Chip>
            )}
          </View>

          {/* 描述 */}
          {dish.description && (
            <Text variant="bodyLarge" style={styles.description}>
              {dish.description}
            </Text>
          )}

          {/* 标签 */}
          {dish.tags && dish.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {dish.tags.map((tag, index) => (
                <Chip
                  key={index}
                  style={styles.tagChip}
                  textStyle={styles.tagChipText}
                >
                  {tag}
                </Chip>
              ))}
            </View>
          )}

          {/* 营养成分 */}
          <View style={styles.nutritionContainer}>
            <Text variant="titleMedium" style={styles.nutritionTitle}>
              营养成分（每份）
            </Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>
                  {dish.nutrition.calories}
                </Text>
                <Text style={styles.nutritionLabel}>卡路里</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>
                  {dish.nutrition.protein}g
                </Text>
                <Text style={styles.nutritionLabel}>蛋白质</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>
                  {dish.nutrition.fat}g
                </Text>
                <Text style={styles.nutritionLabel}>脂肪</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>
                  {dish.nutrition.carbs}g
                </Text>
                <Text style={styles.nutritionLabel}>碳水</Text>
              </View>
            </View>
          </View>

          {/* 换一个按钮 */}
          <Button
            mode="contained"
            onPress={() => refetch()}
            style={styles.refetchButton}
            buttonColor={PRIMARY_COLOR}
            loading={isFetching}
            disabled={isFetching}
            icon="refresh"
          >
            {isFetching ? '获取中...' : '换一个'}
          </Button>
        </Card.Content>
      </Card>
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
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
  },
  // 骨架屏样式
  skeletonContainer: {
    padding: 16,
  },
  skeletonHeader: {
    marginBottom: 16,
  },
  skeletonContent: {
    marginTop: 8,
  },
  skeletonLine: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonTags: {
    flexDirection: 'row',
    gap: 8,
  },
  skeletonChip: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
  },
  // 错误状态样式
  errorTitle: {
    color: ERROR_COLOR,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    color: TEXT_SECONDARY,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 8,
  },
  // 菜品信息样式
  dishName: {
    color: TEXT_PRIMARY,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  chip: {
    backgroundColor: PRIMARY_COLOR + '20',
  },
  chipText: {
    color: PRIMARY_COLOR,
    fontSize: 12,
  },
  description: {
    color: TEXT_SECONDARY,
    marginBottom: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tagChip: {
    backgroundColor: BACKGROUND_LIGHT,
  },
  tagChipText: {
    color: TEXT_SECONDARY,
    fontSize: 12,
  },
  // 营养成分样式
  nutritionContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: BACKGROUND_LIGHT,
    borderRadius: 8,
  },
  nutritionTitle: {
    color: TEXT_PRIMARY,
    marginBottom: 16,
    textAlign: 'center',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  // 按钮样式
  refetchButton: {
    marginTop: 8,
  },
});

