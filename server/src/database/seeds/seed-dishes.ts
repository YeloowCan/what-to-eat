import { AppDataSource } from '../../data-source';
import { Dish } from '../../entities/dish.entity';
import { Nutrition } from '../../entities/dish.entity';

/**
 * 菜品种子数据
 * 包含至少 20-30 个常见菜品，每个菜品包含完整的营养成分数据
 */
const DISH_SEED_DATA: Array<{
  name: string;
  category: string | null;
  cuisineType: string | null;
  nutrition: Nutrition;
  tags: string[] | null;
  description: string | null;
}> = [
  // 川菜
  {
    name: '宫保鸡丁',
    category: '川菜',
    cuisineType: '中式',
    nutrition: { calories: 250, protein: 20, fat: 10, carbs: 15 },
    tags: ['辣', '下饭'],
    description: '经典川菜，麻辣鲜香，鸡肉嫩滑',
  },
  {
    name: '麻婆豆腐',
    category: '川菜',
    cuisineType: '中式',
    nutrition: { calories: 180, protein: 12, fat: 8, carbs: 15 },
    tags: ['辣', '素食'],
    description: '四川传统名菜，豆腐嫩滑，麻辣鲜香',
  },
  {
    name: '回锅肉',
    category: '川菜',
    cuisineType: '中式',
    nutrition: { calories: 320, protein: 18, fat: 22, carbs: 8 },
    tags: ['辣', '下饭'],
    description: '四川经典家常菜，肥而不腻',
  },
  {
    name: '水煮鱼',
    category: '川菜',
    cuisineType: '中式',
    nutrition: { calories: 280, protein: 25, fat: 15, carbs: 10 },
    tags: ['辣', '鱼'],
    description: '川菜代表，鱼肉鲜嫩，麻辣鲜香',
  },

  // 粤菜
  {
    name: '白切鸡',
    category: '粤菜',
    cuisineType: '中式',
    nutrition: { calories: 200, protein: 25, fat: 8, carbs: 0 },
    tags: ['清淡', '健康'],
    description: '广东经典菜，鸡肉鲜嫩，原汁原味',
  },
  {
    name: '叉烧包',
    category: '粤菜',
    cuisineType: '中式',
    nutrition: { calories: 220, protein: 8, fat: 5, carbs: 38 },
    tags: ['主食', '点心'],
    description: '广式点心，香甜可口',
  },
  {
    name: '清蒸鲈鱼',
    category: '粤菜',
    cuisineType: '中式',
    nutrition: { calories: 150, protein: 20, fat: 5, carbs: 0 },
    tags: ['清淡', '鱼', '健康'],
    description: '粤菜经典，鱼肉鲜嫩，清淡健康',
  },
  {
    name: '白灼虾',
    category: '粤菜',
    cuisineType: '中式',
    nutrition: { calories: 100, protein: 18, fat: 1, carbs: 1 },
    tags: ['清淡', '海鲜', '健康'],
    description: '粤菜代表，虾肉鲜甜，原汁原味',
  },

  // 湘菜
  {
    name: '剁椒鱼头',
    category: '湘菜',
    cuisineType: '中式',
    nutrition: { calories: 200, protein: 22, fat: 8, carbs: 5 },
    tags: ['辣', '鱼'],
    description: '湖南名菜，鱼头鲜嫩，剁椒香辣',
  },
  {
    name: '小炒肉',
    category: '湘菜',
    cuisineType: '中式',
    nutrition: { calories: 280, protein: 20, fat: 18, carbs: 8 },
    tags: ['辣', '下饭'],
    description: '湖南家常菜，香辣下饭',
  },

  // 鲁菜
  {
    name: '糖醋里脊',
    category: '鲁菜',
    cuisineType: '中式',
    nutrition: { calories: 300, protein: 18, fat: 12, carbs: 28 },
    tags: ['酸甜', '下饭'],
    description: '鲁菜经典，酸甜可口，外酥内嫩',
  },
  {
    name: '红烧肉',
    category: '鲁菜',
    cuisineType: '中式',
    nutrition: { calories: 350, protein: 20, fat: 25, carbs: 10 },
    tags: ['下饭', '经典'],
    description: '经典鲁菜，肥而不腻，入口即化',
  },

  // 主食类
  {
    name: '蛋炒饭',
    category: '主食',
    cuisineType: '中式',
    nutrition: { calories: 260, protein: 8, fat: 6, carbs: 45 },
    tags: ['主食', '家常'],
    description: '经典主食，简单美味',
  },
  {
    name: '牛肉面',
    category: '主食',
    cuisineType: '中式',
    nutrition: { calories: 320, protein: 22, fat: 8, carbs: 40 },
    tags: ['主食', '面食'],
    description: '经典面食，牛肉鲜香，面条劲道',
  },
  {
    name: '小笼包',
    category: '主食',
    cuisineType: '中式',
    nutrition: { calories: 200, protein: 8, fat: 5, carbs: 35 },
    tags: ['主食', '点心'],
    description: '上海特色，皮薄馅大，汤汁丰富',
  },
  {
    name: '饺子',
    category: '主食',
    cuisineType: '中式',
    nutrition: { calories: 220, protein: 8, fat: 5, carbs: 38 },
    tags: ['主食', '传统'],
    description: '中国传统美食，馅料丰富',
  },

  // 汤类
  {
    name: '西红柿鸡蛋汤',
    category: '汤类',
    cuisineType: '中式',
    nutrition: { calories: 60, protein: 4, fat: 2, carbs: 6 },
    tags: ['汤', '清淡', '家常'],
    description: '经典家常汤，酸甜可口',
  },
  {
    name: '冬瓜排骨汤',
    category: '汤类',
    cuisineType: '中式',
    nutrition: { calories: 80, protein: 6, fat: 3, carbs: 4 },
    tags: ['汤', '清淡', '健康'],
    description: '营养汤品，清淡健康',
  },
  {
    name: '紫菜蛋花汤',
    category: '汤类',
    cuisineType: '中式',
    nutrition: { calories: 40, protein: 3, fat: 1, carbs: 3 },
    tags: ['汤', '清淡'],
    description: '简单汤品，清淡爽口',
  },

  // 素菜
  {
    name: '蒜蓉西兰花',
    category: '素菜',
    cuisineType: '中式',
    nutrition: { calories: 50, protein: 4, fat: 2, carbs: 6 },
    tags: ['素食', '健康', '清淡'],
    description: '健康素菜，营养丰富',
  },
  {
    name: '地三鲜',
    category: '素菜',
    cuisineType: '中式',
    nutrition: { calories: 180, protein: 4, fat: 10, carbs: 20 },
    tags: ['素食', '下饭'],
    description: '东北名菜，茄子、土豆、青椒',
  },
  {
    name: '麻婆豆腐（素）',
    category: '素菜',
    cuisineType: '中式',
    nutrition: { calories: 150, protein: 10, fat: 6, carbs: 12 },
    tags: ['素食', '辣'],
    description: '素食版麻婆豆腐，同样美味',
  },

  // 海鲜类
  {
    name: '清蒸大闸蟹',
    category: '海鲜',
    cuisineType: '中式',
    nutrition: { calories: 120, protein: 20, fat: 3, carbs: 2 },
    tags: ['海鲜', '清淡', '时令'],
    description: '时令美食，蟹黄鲜美',
  },
  {
    name: '蒜蓉粉丝蒸扇贝',
    category: '海鲜',
    cuisineType: '中式',
    nutrition: { calories: 110, protein: 16, fat: 2, carbs: 5 },
    tags: ['海鲜', '清淡'],
    description: '海鲜佳肴，扇贝鲜嫩',
  },

  // 日式
  {
    name: '寿司',
    category: '日式',
    cuisineType: '日式',
    nutrition: { calories: 180, protein: 8, fat: 2, carbs: 35 },
    tags: ['日式', '清淡', '健康'],
    description: '日式经典，精致美味',
  },
  {
    name: '拉面',
    category: '日式',
    cuisineType: '日式',
    nutrition: { calories: 350, protein: 15, fat: 8, carbs: 55 },
    tags: ['日式', '主食'],
    description: '日式拉面，汤浓面劲',
  },

  // 西式
  {
    name: '意大利面',
    category: '西式',
    cuisineType: '西式',
    nutrition: { calories: 280, protein: 12, fat: 6, carbs: 48 },
    tags: ['西式', '主食'],
    description: '经典西餐，面条劲道',
  },
  {
    name: '牛排',
    category: '西式',
    cuisineType: '西式',
    nutrition: { calories: 300, protein: 26, fat: 18, carbs: 0 },
    tags: ['西式', '高蛋白'],
    description: '西式经典，肉质鲜嫩',
  },
  {
    name: '沙拉',
    category: '西式',
    cuisineType: '西式',
    nutrition: { calories: 80, protein: 3, fat: 4, carbs: 8 },
    tags: ['西式', '健康', '清淡'],
    description: '健康西餐，营养丰富',
  },

  // 韩式
  {
    name: '石锅拌饭',
    category: '韩式',
    cuisineType: '韩式',
    nutrition: { calories: 320, protein: 12, fat: 8, carbs: 50 },
    tags: ['韩式', '主食'],
    description: '韩式经典，营养丰富',
  },
  {
    name: '泡菜汤',
    category: '韩式',
    cuisineType: '韩式',
    nutrition: { calories: 100, protein: 6, fat: 3, carbs: 10 },
    tags: ['韩式', '汤', '辣'],
    description: '韩式汤品，酸辣开胃',
  },
];

/**
 * 菜品种子数据脚本
 * 可重复运行（幂等性）：通过检查菜品名称是否存在来避免重复插入
 */
async function seedDishes() {
  try {
    // 初始化数据源连接
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ 数据库连接已建立');
    }

    const dishRepository = AppDataSource.getRepository(Dish);

    let insertedCount = 0;
    let skippedCount = 0;

    // 遍历种子数据
    for (const dishData of DISH_SEED_DATA) {
      // 检查菜品是否已存在（根据名称）
      const existingDish = await dishRepository.findOne({
        where: { name: dishData.name },
      });

      if (existingDish) {
        console.log(`⏭️  跳过已存在的菜品: ${dishData.name}`);
        skippedCount++;
        continue;
      }

      // 创建新菜品
      const dish = dishRepository.create({
        name: dishData.name,
        category: dishData.category,
        cuisineType: dishData.cuisineType,
        nutrition: dishData.nutrition,
        tags: dishData.tags,
        description: dishData.description,
        userId: null, // 种子数据不关联用户
      });

      await dishRepository.save(dish);
      console.log(`✅ 已插入菜品: ${dishData.name}`);
      insertedCount++;
    }

    console.log('\n📊 种子数据插入完成:');
    console.log(`   - 新插入: ${insertedCount} 个菜品`);
    console.log(`   - 已跳过: ${skippedCount} 个菜品`);
    console.log(`   - 总计: ${DISH_SEED_DATA.length} 个菜品`);
  } catch (error) {
    console.error('❌ 种子数据插入失败:', error);
    throw error;
  } finally {
    // 关闭数据库连接
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('✅ 数据库连接已关闭');
    }
  }
}

// 如果直接运行此脚本，执行种子数据插入
if (require.main === module) {
  seedDishes()
    .then(() => {
      console.log('\n✅ 种子数据脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 种子数据脚本执行失败:', error);
      process.exit(1);
    });
}

export { seedDishes };

