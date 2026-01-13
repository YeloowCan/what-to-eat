/**
 * 菜品相关类型定义
 * 与后端 Dish 实体结构保持一致
 */

/**
 * 营养成分接口
 * 用于存储菜品的营养成分信息
 */
export interface Nutrition {
  calories: number; // 卡路里（kcal）
  protein: number; // 蛋白质（g）
  fat: number; // 脂肪（g）
  carbs: number; // 碳水化合物（g）
}

/**
 * 菜品接口
 * 对应后端 Dish 实体
 */
export interface Dish {
  id: number; // 菜品 ID
  name: string; // 菜品名称
  category: string | null; // 菜品分类
  cuisineType: string | null; // 菜系类型
  nutrition: Nutrition; // 营养成分
  tags: string[] | null; // 标签数组
  description: string | null; // 菜品描述
  userId: number | null; // 创建者用户 ID
  createdAt: string; // 创建时间（ISO 8601 格式字符串）
}
