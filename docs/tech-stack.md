# What-to-Eat 技术栈文档

## 1. 技术栈概述

本项目采用现代化的全栈技术架构，确保高性能、可扩展性和良好的开发体验。

### 技术选型
- **前端**：React Native + Expo
- **后端**：NestJS
- **数据库**：PostgreSQL
- **缓存**：Redis（可选）
- **文件存储**：云存储服务（OSS/S3）

## 2. 前端技术栈

### 2.1 React Native + Expo

#### 为什么选择 React Native + Expo？

**React Native 优势：**
- 跨平台开发：一套代码同时支持 iOS 和 Android
- 性能接近原生应用
- 丰富的生态系统和社区支持
- 热重载，开发效率高

**Expo 优势：**
- 简化开发流程，无需配置原生代码
- 内置常用 API（相机、文件系统、通知等）
- 快速构建和部署
- 丰富的 Expo SDK 和插件生态

#### 核心依赖

```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.74.0",
    "expo-router": "^3.5.0",
    "expo-camera": "~15.0.0",
    "expo-image-picker": "~15.0.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "axios": "^1.6.0",
    "react-native-paper": "^5.11.0",
    "react-native-vector-icons": "^10.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.49.0",
    "date-fns": "^3.0.0"
  }
}
```

#### 项目结构

```
mobile/
├── app/                    # Expo Router 路由
│   ├── (auth)/            # 认证相关页面
│   ├── (tabs)/            # 底部导航页面
│   └── _layout.tsx        # 根布局
├── components/            # 可复用组件
│   ├── common/           # 通用组件
│   ├── forms/            # 表单组件
│   └── cards/            # 卡片组件
├── services/              # API 服务
│   ├── api.ts            # API 客户端
│   └── auth.ts           # 认证服务
├── store/                 # 状态管理
│   ├── authStore.ts      # 认证状态
│   └── userStore.ts      # 用户状态
├── hooks/                 # 自定义 Hooks
├── utils/                 # 工具函数
├── types/                 # TypeScript 类型定义
├── constants/             # 常量定义
└── assets/                # 静态资源
```

#### 主要功能模块

**路由管理：Expo Router**
- 基于文件系统的路由
- 支持嵌套路由和动态路由
- 内置导航和布局系统

**状态管理：Zustand**
- 轻量级状态管理库
- 简单易用的 API
- 支持中间件和持久化

**数据获取：React Query**
- 自动缓存和同步
- 后台数据更新
- 请求去重和重试

**UI 组件库：React Native Paper**
- Material Design 风格
- 丰富的组件集合
- 主题定制支持

**表单管理：React Hook Form**
- 高性能表单处理
- 内置验证
- 与 React Native 良好集成

### 2.2 开发工具

- **Expo CLI**：项目创建和管理
- **Expo Go**：开发时快速预览
- **Metro Bundler**：JavaScript 打包工具
- **TypeScript**：类型安全
- **ESLint + Prettier**：代码规范

## 3. 后端技术栈

### 3.1 NestJS

#### 为什么选择 NestJS？

- **模块化架构**：基于 Angular 的模块化设计，代码组织清晰
- **TypeScript 原生支持**：完整的类型安全
- **依赖注入**：便于测试和维护
- **丰富的生态系统**：内置支持 GraphQL、WebSocket、微服务等
- **企业级特性**：中间件、守卫、拦截器、异常过滤器等
- **ORM 集成**：与 TypeORM、Prisma 等良好集成

#### 核心依赖

```json
{
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/typeorm": "^10.0.1",
    "@nestjs/config": "^3.1.1",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "typeorm": "^0.3.17",
    "pg": "^8.11.3",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0",
    "bcrypt": "^5.1.1",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "axios": "^1.6.0",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.33.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.2.1",
    "@nestjs/schematics": "^10.0.3",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.3"
  }
}
```

#### 项目结构

```
server/
├── src/
│   ├── main.ts                    # 应用入口
│   ├── app.module.ts              # 根模块
│   ├── common/                    # 通用模块
│   │   ├── decorators/           # 自定义装饰器
│   │   ├── filters/              # 异常过滤器
│   │   ├── guards/               # 守卫
│   │   ├── interceptors/         # 拦截器
│   │   └── pipes/                # 管道
│   ├── config/                    # 配置文件
│   ├── database/                  # 数据库配置
│   │   └── migrations/           # 数据库迁移
│   ├── modules/                   # 业务模块
│   │   ├── auth/                 # 认证模块
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── strategies/       # 认证策略
│   │   │   └── dto/              # 数据传输对象
│   │   ├── users/                # 用户模块
│   │   ├── dishes/               # 菜品模块
│   │   ├── diet-records/         # 饮食记录模块
│   │   ├── health-analysis/      # 健康分析模块
│   │   └── recommendations/      # 推荐模块
│   ├── ai/                        # AI 服务模块
│   │   ├── image-recognition/    # 图像识别
│   │   └── nutrition-analysis/   # 营养分析
│   └── utils/                     # 工具函数
├── test/                           # 测试文件
├── nest-cli.json                   # NestJS CLI 配置
├── tsconfig.json                   # TypeScript 配置
└── package.json
```

#### 核心特性

**模块化设计**
- 每个功能模块独立（用户、菜品、饮食记录等）
- 模块间通过依赖注入通信
- 便于测试和维护

**认证与授权**
- JWT Token 认证
- Passport 策略（JWT、Local）
- 角色和权限管理（RBAC）

**数据验证**
- class-validator：DTO 验证
- class-transformer：数据转换
- 自动验证和错误处理

**文件上传**
- Multer 处理文件上传
- Sharp 处理图片压缩和转换
- 云存储集成

**API 文档**
- Swagger/OpenAPI 自动生成
- 接口文档和测试

### 3.2 开发工具

- **NestJS CLI**：项目脚手架和代码生成
- **TypeScript**：类型安全
- **ESLint + Prettier**：代码规范
- **Jest**：单元测试和集成测试
- **Supertest**：API 测试

## 4. 数据库

### 4.1 PostgreSQL

#### 为什么选择 PostgreSQL？

- **开源且功能强大**：支持复杂查询和高级特性
- **ACID 事务支持**：数据一致性保证
- **丰富的数据类型**：JSON、数组、地理数据等
- **优秀的性能**：适合复杂查询和大数据量
- **扩展性强**：支持多种扩展和插件
- **良好的生态**：与 TypeORM、Prisma 等 ORM 良好集成

#### 数据库设计

**核心表结构：**

```sql
-- 用户表
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  profile JSONB,  -- 身高、体重、年龄、性别等
  preferences JSONB,  -- 饮食偏好、忌口等
  goals JSONB,  -- 健康目标
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 菜品表
CREATE TABLE dishes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  cuisine_type VARCHAR(50),
  nutrition JSONB NOT NULL,  -- 营养成分
  tags TEXT[],  -- 标签数组
  image_url VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 饮食记录表
CREATE TABLE diet_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type VARCHAR(20) NOT NULL,  -- breakfast/lunch/dinner/snack
  dishes JSONB NOT NULL,  -- 菜品信息数组
  images TEXT[],  -- 图片URL数组
  total_calories DECIMAL(10, 2),
  nutrition_info JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date, meal_type)
);

-- 健康分析表
CREATE TABLE health_analysis (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  health_score INTEGER,  -- 0-100
  nutrition_analysis JSONB,
  issues JSONB,  -- 识别的问题列表
  suggestions JSONB,  -- AI生成的建议
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- 索引
CREATE INDEX idx_diet_records_user_date ON diet_records(user_id, date);
CREATE INDEX idx_health_analysis_user_date ON health_analysis(user_id, date);
CREATE INDEX idx_dishes_category ON dishes(category);
```

#### ORM：TypeORM

**优势：**
- 与 NestJS 深度集成
- 支持实体、关系、迁移
- 查询构建器
- 事务支持

**实体示例：**

```typescript
// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column('jsonb', { nullable: true })
  profile: Record<string, any>;

  @Column('jsonb', { nullable: true })
  preferences: Record<string, any>;

  @Column('jsonb', { nullable: true })
  goals: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 4.2 数据库迁移

使用 TypeORM Migrations 管理数据库版本：

```bash
# 生成迁移文件
pnpm run migration:generate -- -n MigrationName

# 运行迁移
pnpm run migration:run

# 回滚迁移
pnpm run migration:revert
```

## 5. 开发环境配置

### 5.1 前端环境

**系统要求：**
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Expo CLI

**安装步骤：**

```bash
# 安装 Expo CLI
pnpm add -g expo-cli

# 创建项目
pnpm create expo-app@latest what-to-eat-mobile

# 安装依赖
cd what-to-eat-mobile
pnpm install

# 启动开发服务器
pnpm expo start
```

**环境变量：**

```env
# .env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_IMAGE_UPLOAD_URL=https://your-oss-endpoint.com
```

### 5.2 后端环境

**系统要求：**
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 14.0

**安装步骤：**

```bash
# 安装 NestJS CLI
pnpm add -g @nestjs/cli

# 创建项目
nest new what-to-eat-server

# 安装依赖
cd what-to-eat-server
pnpm install

# 启动开发服务器
pnpm run start:dev
```

**环境变量：**

```env
# .env
NODE_ENV=development
PORT=3000

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=what_to_eat

# JWT 配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# 文件存储
OSS_ACCESS_KEY_ID=your_access_key
OSS_ACCESS_KEY_SECRET=your_secret
OSS_BUCKET=your_bucket
OSS_REGION=your_region
```

### 5.3 数据库环境

**安装 PostgreSQL：**

```bash
# macOS (使用 Homebrew)
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt-get install postgresql-14

# Windows
# 下载安装包：https://www.postgresql.org/download/windows/
```

**创建数据库：**

```sql
-- 连接到 PostgreSQL
psql -U postgres

-- 创建数据库
CREATE DATABASE what_to_eat;

-- 创建用户（可选）
CREATE USER what_to_eat_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE what_to_eat TO what_to_eat_user;
```

## 6. API 设计

### 6.1 RESTful API 规范

**基础 URL：** `https://api.what-to-eat.com/v1`

**认证方式：** Bearer Token (JWT)

**响应格式：**

```typescript
// 成功响应
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### 6.2 主要 API 端点

**认证相关：**
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `POST /auth/refresh` - 刷新 Token
- `POST /auth/logout` - 用户登出

**用户相关：**
- `GET /users/profile` - 获取用户信息
- `PUT /users/profile` - 更新用户信息
- `GET /users/stats` - 获取用户统计数据

**菜品相关：**
- `GET /dishes` - 获取菜品列表（支持分页、筛选）
- `GET /dishes/:id` - 获取菜品详情
- `GET /dishes/recommend` - 获取推荐菜品

**饮食记录：**
- `POST /diet-records` - 创建饮食记录
- `GET /diet-records` - 获取饮食记录列表
- `GET /diet-records/:id` - 获取饮食记录详情
- `PUT /diet-records/:id` - 更新饮食记录
- `DELETE /diet-records/:id` - 删除饮食记录

**健康分析：**
- `GET /health-analysis/today` - 获取今日健康分析
- `GET /health-analysis/range` - 获取日期范围健康分析
- `POST /health-analysis/analyze` - 触发健康分析

**推荐：**
- `GET /recommendations/daily` - 获取每日推荐
- `GET /recommendations/personalized` - 获取个性化推荐

## 7. 部署方案

### 7.1 前端部署

**Expo 构建：**

```bash
# 构建 Android APK
eas build --platform android

# 构建 iOS IPA
eas build --platform ios

# 提交到应用商店
eas submit --platform android
eas submit --platform ios
```

**OTA 更新：**

```bash
# 发布 OTA 更新
eas update --branch production --message "更新说明"
```

### 7.2 后端部署

**Docker 部署：**

```dockerfile
# Dockerfile
FROM node:18-alpine

# 安装 pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY . .
RUN pnpm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

**Docker Compose：**

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
    depends_on:
      - postgres

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=what_to_eat
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 7.3 数据库备份

```bash
# 备份数据库
pg_dump -U postgres what_to_eat > backup.sql

# 恢复数据库
psql -U postgres what_to_eat < backup.sql
```

## 8. 性能优化

### 8.1 前端优化

- **图片优化**：使用 Expo Image 组件，支持懒加载和缓存
- **代码分割**：按需加载路由和组件
- **状态管理优化**：使用 React Query 缓存 API 响应
- **列表优化**：使用 FlatList 虚拟化长列表

### 8.2 后端优化

- **数据库索引**：为常用查询字段添加索引
- **查询优化**：使用 TypeORM 查询构建器优化复杂查询
- **缓存策略**：使用 Redis 缓存热点数据
- **分页**：所有列表接口支持分页
- **连接池**：配置数据库连接池

### 8.3 数据库优化

- **索引优化**：根据查询模式创建合适的索引
- **查询分析**：使用 EXPLAIN ANALYZE 分析慢查询
- **分区表**：对于大数据量表考虑分区
- **定期维护**：VACUUM 和 ANALYZE

## 9. 安全考虑

### 9.1 认证安全

- JWT Token 使用强密钥
- Token 设置合理的过期时间
- 实现 Token 刷新机制
- 密码使用 bcrypt 加密存储

### 9.2 API 安全

- 使用 HTTPS
- 实现 Rate Limiting
- 输入验证和 SQL 注入防护
- CORS 配置

### 9.3 数据安全

- 敏感数据加密存储
- 用户数据访问权限控制
- 定期备份数据
- 遵循 GDPR 等数据保护法规

## 10. 监控与日志

### 10.1 日志管理

- **前端**：使用 Sentry 或类似工具捕获错误
- **后端**：使用 Winston 或 Pino 记录日志
- **结构化日志**：使用 JSON 格式便于分析

### 10.2 监控指标

- API 响应时间
- 错误率
- 数据库连接数
- 服务器资源使用情况

## 11. 测试策略

### 11.1 前端测试

- **单元测试**：Jest + React Native Testing Library
- **组件测试**：测试 UI 组件渲染和交互
- **E2E 测试**：Detox 或 Appium

### 11.2 后端测试

- **单元测试**：Jest
- **集成测试**：Supertest 测试 API
- **E2E 测试**：完整业务流程测试

## 12. 开发工作流

### 12.1 Git 工作流

- 使用 Git Flow 或 GitHub Flow
- 功能分支命名：`feature/功能名称`
- 提交信息规范：Conventional Commits

### 12.2 CI/CD

- **GitHub Actions** 或 **GitLab CI**
- 自动化测试
- 自动化构建和部署
- 代码质量检查

---

**文档版本**：v1.0  
**最后更新**：2025年12月31日

