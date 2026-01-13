import { Nutrition } from '../entities/dish.entity';

/**
 * 营养成分计算工具
 * 根据菜品名称和分量估算营养成分
 * 注意：无现成数据库，使用简单规则或固定值
 */

/**
 * 默认营养成分值（每100g）
 * 用于未知菜品或作为基础值
 */
const DEFAULT_NUTRITION: Nutrition = {
  calories: 150, // 中等卡路里
  protein: 10, // 中等蛋白质
  fat: 5, // 低脂肪
  carbs: 20, // 中等碳水化合物
};

/**
 * 菜品关键词与营养成分的映射规则
 * 基于常见食材和菜品的营养成分特征
 */
const NUTRITION_RULES: Array<{
  keywords: string[]; // 关键词列表
  nutrition: Nutrition; // 每100g的营养成分
}> = [
  // 高蛋白类（肉类、蛋类）
  {
    keywords: ['鸡', '鸡肉', '鸡丁', '鸡胸', '鸡腿', '鸡翅'],
    nutrition: { calories: 200, protein: 25, fat: 8, carbs: 0 },
  },
  {
    keywords: ['猪', '猪肉', '排骨', '红烧肉', '回锅肉'],
    nutrition: { calories: 300, protein: 20, fat: 25, carbs: 0 },
  },
  {
    keywords: ['牛', '牛肉', '牛排', '牛腩', '牛肉面'],
    nutrition: { calories: 250, protein: 26, fat: 15, carbs: 0 },
  },
  {
    keywords: ['鱼', '鱼肉', '鱼片', '清蒸鱼', '红烧鱼'],
    nutrition: { calories: 150, protein: 20, fat: 5, carbs: 0 },
  },
  {
    keywords: ['虾', '虾仁', '大虾', '白灼虾'],
    nutrition: { calories: 100, protein: 18, fat: 1, carbs: 1 },
  },
  {
    keywords: ['蛋', '鸡蛋', '蛋花', '炒蛋', '蒸蛋'],
    nutrition: { calories: 150, protein: 13, fat: 10, carbs: 1 },
  },

  // 蔬菜类（低卡路里）
  {
    keywords: ['青菜', '白菜', '菠菜', '生菜', '芹菜', '韭菜'],
    nutrition: { calories: 20, protein: 2, fat: 0, carbs: 4 },
  },
  {
    keywords: ['番茄', '西红柿', '茄子', '黄瓜', '冬瓜'],
    nutrition: { calories: 15, protein: 1, fat: 0, carbs: 3 },
  },
  {
    keywords: ['豆', '豆腐', '豆芽', '豆角', '毛豆'],
    nutrition: { calories: 80, protein: 8, fat: 3, carbs: 5 },
  },

  // 主食类（高碳水化合物）
  {
    keywords: ['饭', '米饭', '炒饭', '盖饭'],
    nutrition: { calories: 130, protein: 3, fat: 0, carbs: 28 },
  },
  {
    keywords: ['面', '面条', '拉面', '汤面', '拌面'],
    nutrition: { calories: 110, protein: 4, fat: 1, carbs: 22 },
  },
  {
    keywords: ['包', '包子', '饺子', '馄饨'],
    nutrition: { calories: 200, protein: 8, fat: 5, carbs: 35 },
  },

  // 高脂肪类
  {
    keywords: ['炸', '油炸', '炸鸡', '炸鱼'],
    nutrition: { calories: 350, protein: 15, fat: 25, carbs: 15 },
  },
  {
    keywords: ['烤', '烧烤', '烤肉', '烤鱼'],
    nutrition: { calories: 250, protein: 20, fat: 15, carbs: 5 },
  },

  // 汤类（低卡路里）
  {
    keywords: ['汤', '鸡汤', '鱼汤', '排骨汤'],
    nutrition: { calories: 30, protein: 3, fat: 1, carbs: 2 },
  },
];

/**
 * 根据菜品名称估算营养成分
 * @param dishName 菜品名称
 * @param portion 分量（克），默认 200g（一份）
 * @returns 估算的营养成分
 */
export function estimateNutrition(
  dishName: string,
  portion: number = 200,
): Nutrition {
  if (!dishName || dishName.trim().length === 0) {
    // 如果菜品名称为空，返回默认值
    return scaleNutrition(DEFAULT_NUTRITION, portion);
  }

  const normalizedName = dishName.toLowerCase().trim();

  // 遍历规则，查找匹配的关键词
  for (const rule of NUTRITION_RULES) {
    for (const keyword of rule.keywords) {
      if (normalizedName.includes(keyword.toLowerCase())) {
        // 找到匹配的关键词，使用对应的营养成分
        return scaleNutrition(rule.nutrition, portion);
      }
    }
  }

  // 如果没有匹配的规则，返回默认值
  return scaleNutrition(DEFAULT_NUTRITION, portion);
}

/**
 * 根据分量缩放营养成分
 * @param nutrition 每100g的营养成分
 * @param portion 分量（克）
 * @returns 缩放后的营养成分
 */
function scaleNutrition(nutrition: Nutrition, portion: number): Nutrition {
  const scale = portion / 100; // 计算缩放比例
  return {
    calories: Math.round(nutrition.calories * scale),
    protein: Math.round(nutrition.protein * scale * 10) / 10, // 保留一位小数
    fat: Math.round(nutrition.fat * scale * 10) / 10,
    carbs: Math.round(nutrition.carbs * scale * 10) / 10,
  };
}

/**
 * 获取默认营养成分值
 * @param portion 分量（克），默认 200g（一份）
 * @returns 默认营养成分
 */
export function getDefaultNutrition(portion: number = 200): Nutrition {
  return scaleNutrition(DEFAULT_NUTRITION, portion);
}

